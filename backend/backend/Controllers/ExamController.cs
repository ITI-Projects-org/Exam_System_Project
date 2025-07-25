﻿using AutoMapper;
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
                var studentExamRecord = _unit.StudentExamRepository.GetByStudentAndExamAsync(currentUserId, examId);

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
            var studExam = _unit.StudentExamRepository.GetByStudentAndExamAsync(studentId, examId);
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
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> TakeExam(int ExamId)
        {
            try
            {
                var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var studExam = _unit.StudentExamRepository.GetByStudentAndExamAsync(currentUserId, ExamId);
                if (studExam == null)
                    return BadRequest("You are not enrolled in this exam.");

                if (!studExam.IsAbsent)
                    return BadRequest("You have already taken this exam.");

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

                // 3. Update the existing entity's properties (keep the same tracked entity)
                existingExam.Title = examDTO.Title;
                existingExam.StartDate = examDTO.StartDate;
                existingExam.Duration = examDTO.Duration;
                existingExam.CourseId = examDTO.CourseId;
                existingExam.MaxDegree = examDTO.MaxDegree;
                existingExam.MinDegree = examDTO.MinDegree;
                //existingExam.IsAbsent = examDTO.IsAbsent;
                // Keep the same TeacherId - don't change it




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
            var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Prevent double submission
            var studentExam = _unit.StudentExamRepository.GetByStudentAndExamAsync(studentId, examId);

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


            studentExam.StudentId = studentId;
            studentExam.ExamId = examId;
            //studentExam.StudStartDate = now; // when take
            studentExam.StudEndDate = now;
            //studentExam.StudDegree = 0; // calculated 
            studentExam.IsAbsent = false;


            // Calculate degree
            int degree = 0;
            var questions = await _unit.QuestionRepository.GetExamWithQuestionsWithOptions(examId);
            var results = new List<object>();
            foreach (var answer in answers)
            {

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
            studentExam.StudDegree = degree;
            await _unit.StudentExamRepository.UpdateAsync(studentExam);
            await _unit.SaveAsync();

            return Ok(new { success = true, degree, results });
        }

        [HttpGet("isExamTaken/{examId}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> isExamTakenAsync(int examId)
        {
            string studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(studentId))
                return BadRequest(new { Message = "Student ID not found" });
            
            var studExam = _unit.StudentExamRepository.GetByStudentAndExamAsync(studentId, examId);
            
            if (studExam == null)
                return Ok(false); // Student not assigned to this exam
            
            // Check if student has submitted answers (more reliable than IsAbsent)
            var hasSubmittedAnswers = await _unit.StudentOptionRepository.GetAllStudentOptions(studentId);
            var examQuestions = await _unit.QuestionRepository.GetExamWithQuestionsWithOptions(examId);
            
            // Check if student has answered any questions for this exam
            var hasAnswered = examQuestions.Questions.Any(q => 
                q.Options.Any(o => hasSubmittedAnswers.Any(so => so.OptionId == o.Id))
            );
            
            // For now, let's use the simpler IsAbsent logic but add debugging
            bool isTaken = !studExam.IsAbsent;
            
            Console.WriteLine($"Exam {examId} for student {studentId}: IsAbsent={studExam.IsAbsent}, hasAnswered={hasAnswered}, isTaken={isTaken}");
            
            return Ok(new { isTaken = isTaken });
        }

    }
}