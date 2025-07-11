using AutoMapper;
using backend.DTOs;
using backend.Models;
using backend.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamController : ControllerBase
    {
        IUnitOfWork _unit { get; }
        IMapper _mapper;
        public ExamController(IUnitOfWork unit, IMapper mapper)
        {
            _unit = unit;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize]
        public async Task<IEnumerable<ExamDTO>> GetExams()
        {
            var UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            string Role = User.FindFirstValue(ClaimTypes.Role);
            IEnumerable<Exam> Exams = new List<Exam>();
            if (Role == "Teacher")
                Exams = await _unit.ExamRepository.GetAllExamsofTeacher(UserId);
            else if (Role == "Student")
                Exams = await _unit.ExamRepository.GetAllExamsofStudent(UserId);
            List<ExamDTO> ExamsDTO = new List<ExamDTO>();
            foreach (var item in Exams)
            {
                ExamDTO ExamDTO = new ExamDTO()
                {
                    Id = item.Id,
                    StartDate = item.StartDate,
                    Duration = item.Duration,
                    Title = item.Title,
                    MaxDegree = item.MaxDegree,
                    MinDegree = item.MinDegree
                };
                ExamsDTO.Add(ExamDTO);
            }
            return ExamsDTO.ToList();
        }


        //[HttpGet("{examId}")]
        ////[Authorize(Roles = "Student")]
        //public async Task<IActionResult> GetStudentExamDetails(int examId)
        //{
        //    var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //    if (string.IsNullOrEmpty(currentUserId))
        //        return Unauthorized("User ID not found.");

        //    var exam = await _unit.ExamRepository.GetAllQueryable().Result.FirstOrDefaultAsync(e => e.Id == examId);

        //    if (exam == null)
        //        return NotFound($"Exam with ID {examId} not found.");

        //    DateTime currentTime = DateTime.Now;
        //    TimeZoneInfo egyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");
        //    DateTime egyptCurrentTime = TimeZoneInfo.ConvertTime(DateTime.UtcNow, TimeZoneInfo.Utc, egyptTimeZone);
        //    DateTime examEndDate = exam.StartDate + exam.Duration;

        //    var ExamWithQuestionsWithOptions = await _unit.QuestionRepository.GetExamWithQuestionsWithOptions(examId);
        //    //if (egyptCurrentTime < exam.StartDate)
        //    //    return Ok(_mapper.Map<ExamDTO>(exam));


        //    else if (egyptCurrentTime >= exam.StartDate && egyptCurrentTime <= examEndDate)
        //    {
        //        ExamWithQuestionsWithOptions = await _unit.QuestionRepository.GetExamWithQuestionsWithOptions(examId);
        //        var duringExamDTO = _mapper.Map<DuringExamDTO>(ExamWithQuestionsWithOptions);
        //        return Ok(duringExamDTO);
        //    }
        //    else
        //    {
        //        //var afterExam = new AfterExamEndDTO();
        //        var studentExamRecord = await _unit.StudentExamRepository.GetByStudentAndExamAsync(currentUserId, examId).FirstOrDefaultAsync();

        //        if (studentExamRecord == null)
        //        {
        //            var afterExamDTO = _mapper.Map<AfterExamEndDTO>(exam);
        //            afterExamDTO.IsAbsent = true;
        //            return Ok(afterExamDTO);
        //        }
        //        else {
        //            AfterExamEndDTO afterExamDTO = _mapper.Map<AfterExamEndDTO>(exam);
        //            List<Stud_Option> stud_Options = await _unit.StudentOptionRepository.GetAllStudentOptions(currentUserId);
        //            foreach (var question in afterExamDTO.Questions)
        //            {
        //                foreach (var option in question.Options)
        //                {
        //                    if (stud_Options.Select(so => so.OptionId).ToList().Contains(option.Id))
        //                    {
        //                        option.IsChoosedByStudent = true;
        //                    }
        //                }
        //            }
        //            return Ok(afterExamDTO);
        //        }


        //    }

        //    var questionsWithAllOptions = await _unit.QuestionRepository.GetExamWithQuestionsWithOptions(examId);
        //    return Ok();
        //}


        [HttpGet("{examId}")]
        [Authorize]
        public async Task<IActionResult> GetExamDetails(int examId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var UserRole = User.FindFirstValue(ClaimTypes.Role);
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized("User ID not found.");
            var exam = await _unit.ExamRepository.GetAllQueryable().Result.FirstOrDefaultAsync(e => e.Id == examId);
            if (exam == null)
                return NotFound($"Exam with ID {examId} not found.");

            var ExamWithQuestionsWithOptions = await _unit.QuestionRepository.GetExamWithQuestionsWithOptions(examId);
            if (UserRole == "Student")
            {
                var studentExamRecord = await _unit.StudentExamRepository.GetByStudentAndExamAsync(currentUserId, examId).FirstOrDefaultAsync();

                if (studentExamRecord == null)
                {
                    var afterExamDTO = _mapper.Map<AfterExamEndDTO>(exam);
                    afterExamDTO.IsAbsent = true;
                    return Ok(afterExamDTO);
                }
                else
                {
                    AfterExamEndDTO afterExamDTO = _mapper.Map<AfterExamEndDTO>(exam);
                    List<Stud_Option> stud_Options = await _unit.StudentOptionRepository.GetAllStudentOptions(currentUserId);
                    foreach (var question in afterExamDTO.Questions)
                    {
                        foreach (var option in question.Options)
                        {
                            if (stud_Options.Select(so => so.OptionId).ToList().Contains(option.Id))
                            {
                                option.IsChoosedByStudent = true;
                            }
                        }
                    }
                    return Ok(afterExamDTO);
                }
            }
            else if (UserRole == "Teacher")
            {
                AfterExamEndDTO afterExamDTO = _mapper.Map<AfterExamEndDTO>(exam);
                return Ok(afterExamDTO);
            }


            //}

            var questionsWithAllOptions = await _unit.QuestionRepository.GetExamWithQuestionsWithOptions(examId);
            return Ok();
        }

        [HttpGet("{examId}/solve")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetExamToSolve(int examId)
        {
            var studentId = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);

            // Get the exam with questions and options
            var examWithQuestions = await _unit.QuestionRepository.GetExamWithQuestionsWithOptions(examId);

            // Get the student's selected options for this exam
            var studentOptions = (await _unit.StudentOptionRepository.GetAllStudentOptions(studentId))
                //.Where(so => so.ExamId == examId)
                .ToList();

            // Get the student's degree for this exam
            var studExam = await _unit.StudentExamRepository.GetByStudentAndExamAsync(studentId, examId).FirstOrDefaultAsync();
            int studDegree = studExam?.StudDegree ?? 0;

            // Map to AfterExamEndDTO
            var examDto = _mapper.Map<backend.DTOs.AfterExamEndDTO>(examWithQuestions);

            // Set IsChoosedByStudent for each option
            foreach (var question in examDto.Questions)
            {
                foreach (var option in question.Options)
                {
                    option.IsChoosedByStudent = studentOptions.Any(so => so.OptionId == option.Id);
                }
            }

            // Set StudDegree for this student
            examDto.StudDegree = studDegree;

            return Ok(examDto);
        }


        [HttpGet("TakeExam")]
        public async Task<IActionResult> TakeExam(int ExamId)
        {
            try
            {
                var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (currentUserId == null)
                    return Unauthorized("User not authenticated");

                var exam = await _unit.ExamRepository.TakeExam(currentUserId, ExamId);

                if (exam == null)
                    return NotFound("Exam not found or you are not enrolled in this exam");


                await _unit.SaveAsync();
                var examDTO = _mapper.Map<DuringExamDTO>(exam);
                return Ok(examDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while taking the exam");
            }
        }

        [HttpGet("CloseExam")]
        [Authorize(Roles = "Student")]

        public async Task<IActionResult> CloseExam(int ExamId)
        {
            try
            {
                var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                Exam exam = await _unit.ExamRepository.GetStudentExamById(currentUserId, ExamId);
                if (currentUserId == null) return Unauthorized();

                _unit.ExamRepository.CloseExam(currentUserId, ExamId);
                await _unit.SaveAsync();
                return Ok();
            }
            catch (Exception err)
            {
                return StatusCode(500, "error while closing exam");
            }
            return Ok();
        }

        [HttpPost("Assign")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> AssignStudentsToExam([FromQuery] int ExamId, [FromQuery] string[] studs_Id)
        {

            _unit.ExamRepository.AssignStudsToExam(ExamId, studs_Id);
            await _unit.SaveAsync();
            return Ok(new
            {
                Message = "Students assigned to exam successfully",
                ExamId = ExamId,
                StudentIds = studs_Id
            });
        }




        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> AddExam(ExamInputDTO examDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                Exam exam = _mapper.Map<Exam>(examDTO);
                exam.TeacherId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (examDTO.Questions == null || exam.Questions.Count <= 0)
                    return Ok(exam);
                exam.Questions = new List<Question>();
                foreach (var questionDTO in examDTO.Questions)
                {
                    Question question = _mapper.Map<Question>(questionDTO);
                    if (questionDTO.Options == null || questionDTO.Options.Count <= 0)
                        continue;
                    foreach (var optionDTO in questionDTO.Options)
                    {
                        Option option = _mapper.Map<Option>(optionDTO);
                        question.Options.Add(option);

                    }
                    exam.Questions.Add(question);
                }
                await _unit.ExamRepository.Add(exam);
                await _unit.SaveAsync();
                return Ok(exam);
            }

            catch (Exception err) { return BadRequest(err); }
        }


        [HttpPut]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> EditExam(ExamInputDTO examDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // 1. Get the existing exam with all related data
                var existingExam = await _unit.ExamRepository.GetExamByIdWithWithQuestionsWithOptions(examDTO.Id ?? 0);

                if (existingExam == null)
                    return NotFound($"Exam with ID {examDTO.Id} not found");

                // 2. Check ownership
                //var currentTeacherId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                //if (existingExam.TeacherId != currentTeacherId)
                //    return Forbid("You can only edit your own exams");

                // 3. Update the existing entity's properties (keep the same tracked entity)
                existingExam.Title = examDTO.Title;
                existingExam.StartDate = examDTO.StartDate;
                existingExam.Duration = examDTO.Duration;
                existingExam.CourseId = examDTO.CourseId;
                existingExam.MaxDegree = examDTO.MaxDegree;
                existingExam.MinDegree = examDTO.MinDegree;
                //existingExam.IsAbsent = examDTO.IsAbsent;
                // Keep the same TeacherId - don't change it


                // Add new questions

                //existingExam.Questions;
                //foreach (var questionDTO in examDTO.Questions)
                //{
                //    Question question = _mapper.Map<Question>(questionDTO);
                //    question.ExamId = existingExam.Id; // Set the foreign key
                //    _unit.QuestionRepository.Update(question);

                //    if (questionDTO.Options != null && questionDTO.Options.Count > 0)
                //    {
                //        //question.Options = _unit.OptionRepository.GetById();
                //        foreach (var optionDTO in questionDTO.Options)
                //        {
                //            var existingOption = existingQuestion.Options.FirstOrDefault(o => o.Id == optionDTO.Id);

                //            //Option option = _mapper.Map<Option>(optionDTO);
                //            _mapper.Map(optionDTO,)
                //            // Don't set QuestionId manually - EF will handle it
                //            _unit.OptionRepository.Update(existingOption);
                //        }
                //    }
                //    //existingExam.Questions.Add(question);
                //}

                foreach (var questionDTO in examDTO.Questions)
                {
                    var existingQuestion = existingExam.Questions.FirstOrDefault(q => q.Id == questionDTO.Id);

                    if (existingQuestion != null)
                    {
                        // Update existing question
                        _mapper.Map(questionDTO, existingQuestion);

                        // Update or add options
                        foreach (var optionDTO in questionDTO.Options)
                        {
                            var existingOption = existingQuestion.Options.FirstOrDefault(o => o.Id == optionDTO.Id);
                            if (existingOption != null)
                            {
                                _mapper.Map(optionDTO, existingOption);
                            }
                            else
                            {
                                var newOption = _mapper.Map<Option>(optionDTO);
                                existingQuestion.Options.Add(newOption);
                            }
                        }
                    }
                    else
                    {
                        // Add new question
                        var newQuestion = _mapper.Map<Question>(questionDTO);
                        newQuestion.ExamId = existingExam.Id;
                        existingExam.Questions.Add(newQuestion);
                    }
                }
                //}
                //else
                //{
                //    // If no questions provided, remove existing ones
                //    if (existingExam.Questions?.Any() == true)
                //    {
                //        foreach (var question in existingExam.Questions)
                //        {
                //            if (question.Options?.Any() == true)
                //            {
                //                _unit.OptionRepository.RemoveRange(question.Options);
                //            }
                //        }
                //        _unit.QuestionRepository.RemoveRange(existingExam.Questions);
                //        existingExam.Questions.Clear();
                //    }
                //}

                _unit.ExamRepository.Update(existingExam);
                await _unit.SaveAsync();

                // 6. Return success response (avoid circular reference)
                return Ok(new
                {
                    message = "Exam updated successfully",
                    examId = existingExam.Id,
                    title = existingExam.Title
                });
            }
            catch (Exception err)
            {
                return BadRequest(new { error = err.Message });
            }
        }



        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> DeleteExam(int id)
        {
            try
            {
                //var existingExam = await _unit.ExamRepository.GetById(id);
                var existingExam = await _unit.ExamRepository.GetExamByIdWithWithQuestionsWithOptions(id);


                if (existingExam == null)
                    return NotFound($"Exam with ID {id} not found");

                // Check if the teacher owns this exam
                if (existingExam.TeacherId != User.FindFirstValue(ClaimTypes.NameIdentifier))
                    return Forbid("You can only delete your own exams");

                // Check if exam has been taken by students (optional business rule)
                //var hasStudentResults = await _unit.StudentExamRepository.AnyAsync(se => se.ExamId == id);
                //if (hasStudentResults)
                //{
                //    return BadRequest("Cannot delete exam that has been taken by students");
                //}

                // Remove related entities first (if cascade delete is not configured)
                if (existingExam.Questions?.Any() == true)
                {
                    foreach (var question in existingExam.Questions)
                    {
                        if (question.Options?.Any() == true)
                        {
                            _unit.OptionRepository.RemoveRange(question.Options);
                        }
                    }
                    _unit.QuestionRepository.RemoveRange(existingExam.Questions);
                }

                // Remove the exam
                _unit.ExamRepository.Remove(existingExam);
                await _unit.SaveAsync();

                return Ok(new { message = "Exam deleted successfully" });
            }
            catch (Exception err)
            {
                return BadRequest(new { error = err.Message });
            }
        }

        [HttpGet("{examId}/students")]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<IEnumerable<ExamStudentDegreeDTO>>> GetStudentsOfExam(int examId)
        {
            try
            {
                var studExams = await _unit.StudentExamRepository.GetAllQueryable()
                    .Where(se => se.ExamId == examId)
                    .Include(se => se.Student)
                    .ToListAsync();

                var result = studExams.Select(se => new ExamStudentDegreeDTO
                {
                    StudentId = se.StudentId,
                    StudentName = se.Student != null
                        ? ((se.Student.FirstName ?? "") + " " + (se.Student.LastName ?? "")).Trim()
                        : se.StudentId,
                    Degree = se.StudDegree,
                    IsAbsent = se.IsAbsent
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the error (ex.ToString())
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("{examId}/submit")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> SubmitExam(int examId, [FromBody] List<backend.DTOs.ExamSubmitAnswerDTO> answers)
        {
            var studentId = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);

            // Prevent double submission
            var studentExam = await _unit.StudentExamRepository.GetByStudentAndExamAsync(studentId, examId).AnyAsync();
            //if (alreadySubmitted)
            //    return BadRequest("You have already submitted this exam.");

            // Save each selected option
            var studOptions = new List<backend.Models.Stud_Option>();
            foreach (var answer in answers)
            {
                if (answer.OptionIds != null)
                {
                    foreach (var optionId in answer.OptionIds)
                    {
                        studOptions.Add(new backend.Models.Stud_Option
                        {
                            StudentId = studentId,
                            OptionId = optionId
                        });
                    }
                }
            }
            _unit.StudentOptionRepository.AddRange(studOptions);

            // Mark exam as submitted for this student
            var now = DateTime.Now;
            var studExam = new backend.Models.Stud_Exam
            {
                StudentId = studentId,
                ExamId = examId,
                StudStartDate = now,
                StudEndDate = now,
                StudDegree = 0, // Will set below
                IsAbsent = false
            };

            // Calculate degree
            int degree = 0;
            var questions = await _unit.QuestionRepository.GetExamWithQuestionsWithOptions(examId);
            var results = new List<object>();
            foreach (var answer in answers)
            {
                // Fix for CS1061: 'Exam' does not contain a definition for 'FirstOrDefault'  
                // Explanation: The error occurs because 'Exam' is not a collection and does not have LINQ methods like 'FirstOrDefault'.  
                // The correct approach is to use 'questions', which is a collection of questions, instead of 'Exam'.  

                // Original line:  
                // var question = questions.FirstOrDefault(q => q.Id == answer.QuestionId);  

                // Fixed line:  
                var question = questions.Questions.FirstOrDefault(q => q.Id == answer.QuestionId);
                if (question == null) continue;
                var correctOptionIds = question.Options.Where(o => o.IsCorrect == true).Select(o => o.Id).ToList();
                bool isCorrect = answer.OptionIds != null && correctOptionIds.Count == answer.OptionIds.Count &&
                                 !correctOptionIds.Except(answer.OptionIds).Any();
                if (isCorrect)
                {
                    degree += question.Degree;
                }
                results.Add(new
                {
                    questionId = question.Id,
                    questionText = question.Title,
                    selectedOptionIds = answer.OptionIds,
                    correctOptionIds = correctOptionIds,
                    isCorrect = isCorrect,
                    degree = isCorrect ? question.Degree : 0
                });
            }
            studExam.StudDegree = degree;
            await _unit.StudentExamRepository.UpdateAsync(studExam);
            await _unit.SaveAsync();

            return Ok(new { success = true, degree, results });
        }


    }
}