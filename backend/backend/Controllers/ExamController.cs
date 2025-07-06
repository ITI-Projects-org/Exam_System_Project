using AutoMapper;
using backend.DTOs;
using backend.Models;
using backend.Repositories.Implementations;
using backend.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Security.AccessControl;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamController : ControllerBase
    {
        IUnitOfWork _unit { get; }
        IMapper _mapper;
        public ExamController(IUnitOfWork unit,IMapper mapper)
        {
            _unit = unit;
            _mapper = mapper;
        }

        [HttpGet("teacher")]
        [Authorize(Roles = "Teacher")]
        public async Task<IEnumerable<ExamDTO>> GetTeacherExams()
        {
            var UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var Exams = await _unit.ExamRepository.GetAllExamsofTeacher(UserId);
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

        [HttpGet("student")]
        [Authorize(Roles = "Student")]
        public async Task<IEnumerable<ExamDTO>> GetStudentExams()
        {
            var UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var Exams = await _unit.ExamRepository.GetAllExamsofStudent(UserId);
            List<ExamDTO> examDTO =  _mapper.Map<List<ExamDTO>>(Exams);
            return examDTO;
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetStudentExamDetails(int id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized("User ID not found.");

            var exam = await _unit.ExamRepository.GetAllQueryable().Result.FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null)
                return NotFound($"Exam with ID {id} not found.");

            DateTime currentTime = DateTime.Now;
            TimeZoneInfo egyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");
            DateTime egyptCurrentTime = TimeZoneInfo.ConvertTime(DateTime.UtcNow, TimeZoneInfo.Utc, egyptTimeZone);
            DateTime examEndDate = exam.StartDate + exam.Duration;

            var ExamWithQuestionsWithOptions = await _unit.QuestionRepository.GetExamWithQuestionsWithOptions(id);
            if (egyptCurrentTime < exam.StartDate)
                return Ok(_mapper.Map<ExamDTO>(exam));
            

            else if (egyptCurrentTime >= exam.StartDate && egyptCurrentTime <= examEndDate)
            {
                ExamWithQuestionsWithOptions = await _unit.QuestionRepository.GetExamWithQuestionsWithOptions(id);
                var duringExamDTO = _mapper.Map<DuringExamDTO>(ExamWithQuestionsWithOptions);
                return Ok(duringExamDTO);
            }
            else
            {
                //var afterExam = new AfterExamEndDTO();
                var studentExamRecord = await _unit.StudentExamRepository.GetByStudentAndExamAsync(currentUserId, id).FirstOrDefaultAsync();

                if (studentExamRecord == null)
                {
                    var afterExamDTO = _mapper.Map<AfterExamEndDTO>(exam);
                    afterExamDTO.IsAbsent = true;
                    return Ok(afterExamDTO);
                }
                else {
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

                var questionsWithAllOptions = await _unit.QuestionRepository.GetExamWithQuestionsWithOptions(id);
                return Ok();
        }

        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public void AddExam([FromBody] Exam exam)
        {
            _unit.ExamRepository.Add(exam);
        }

        [HttpPut("{id}")]
        public void EditExam([FromBody] Exam exam)
        {
            _unit.ExamRepository.Update(exam.Id.ToString(), exam);
        }

        [HttpDelete("{id}")]
        public void RemoveExam(string Id)
        {
            _unit.ExamRepository.Delete(Id);
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

        public async Task<IActionResult >CloseExam(int ExamId)
        {
            try{
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            Exam exam = await _unit.ExamRepository.GetStudentExamById(currentUserId, ExamId);
            if (currentUserId == null) return Unauthorized();
            
            _unit.ExamRepository.CloseExam(currentUserId, ExamId);
            await _unit.SaveAsync();
            return Ok();
            }
            catch (Exception err) {
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
        //[HttpPost("AddExam")]
        //[Authorize(Roles = "Teacher")]
        //public async Task<IActionResult> AddExam(ExamInputDTO examDTO)
        //{
        //    if (!ModelState.IsValid) 
        //        return BadRequest(ModelState);
        //    try{
        //    Exam exam = _mapper.Map<Exam>(examDTO);
        //    await _unit.SaveAsync();
        //        var exaId = exam.Id;
        //    exam.TeacherId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //    List<Question> questions = _mapper.Map<List<Question>>(examDTO.Questions);


        //    if (questions != null && questions.Count > 0)
        //        foreach (var question in questions)
        //        {
        //            await _unit.QuestionRepository.Add(question);
        //            List<Option> options = _mapper.Map<List<Option>>(question.Options);
        //            foreach (var option  in options)
        //                await _unit.OptionRepository.Add(option);
        //        }

        //    var result = _unit.ExamRepository.Add(exam);
        //    await _unit.SaveAsync();
        //        return Ok(exam); }
        //    catch(Exception err){
        //        return BadRequest(err);
        //    }
        //}
        [HttpPost("AddExam")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> AddExam(ExamInputDTO examDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Map and configure the exam
                Exam exam = _mapper.Map<Exam>(examDTO);
                exam.TeacherId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                // Process questions and their options
                if (examDTO.Questions != null && examDTO.Questions.Count > 0)
                {
                    exam.Questions = new List<Question>();

                    foreach (var questionDTO in examDTO.Questions)
                    {
                        Question question = _mapper.Map<Question>(questionDTO);
                        if (questionDTO.Options != null && questionDTO.Options.Count > 0)
                        {
                            question.Options = new List<Option>();

                            foreach (var optionDTO in questionDTO.Options)
                            {
                                Option option = _mapper.Map<Option>(optionDTO);
                                // Don't set QuestionId manually - EF will handle it through the relationship
                                question.Options.Add(option);
                            }
                        }

                        exam.Questions.Add(question);
                    }
                }

                // Add the exam with all its related data
                await _unit.ExamRepository.Add(exam);
                await _unit.SaveAsync(); // This will save everything in one transaction

                return Ok(exam);
            }
            catch (Exception err)
            {
                return BadRequest(err);
            }
        }



        //[HttpDelete("DeleteExam/{id}")]
        //[Authorize(Roles = "Teacher")]
        //public async Task<IActionResult> DeleteExam(int id)
        //{
        //    try
        //    {
        //        //var existingExam = await _unit.ExamRepository.GetById(id);
        //        var existingExam = await _unit.ExamRepository.GetExamByIdWithWithQuestionsWithOptions(id);


        //        if (existingExam == null)
        //            return NotFound($"Exam with ID {id} not found");

        //        // Check if the teacher owns this exam
        //        if (existingExam.TeacherId != User.FindFirstValue(ClaimTypes.NameIdentifier))
        //            return Forbid("You can only delete your own exams");

        //        // Check if exam has been taken by students (optional business rule)
        //        var hasStudentResults = await _unit.StudentExamRepository.AnyAsync(se => se.ExamId == id);
        //        if (hasStudentResults)
        //        {
        //            return BadRequest("Cannot delete exam that has been taken by students");
        //        }

        //        // Remove related entities first (if cascade delete is not configured)
        //        if (existingExam.Questions?.Any() == true)
        //        {
        //            foreach (var question in existingExam.Questions)
        //            {
        //                if (question.Options?.Any() == true)
        //                {
        //                    _unit.OptionRepository.RemoveRange(question.Options);
        //                }
        //            }
        //            _unit.QuestionRepository.RemoveRange(existingExam.Questions);
        //        }

        //        // Remove the exam
        //        _unit.ExamRepository.Remove(existingExam);
        //        await _unit.SaveAsync();

        //        return Ok(new { message = "Exam deleted successfully" });
        //    }
        //    catch (Exception err)
        //    {
        //        return BadRequest(new { error = err.Message });
        //    }
        //}


    }
}