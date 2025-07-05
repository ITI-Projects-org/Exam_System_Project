using System.Security.Claims;
using backend.DTOs;
using backend.Models;
using ELearning.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamController : ControllerBase
    {
        public UnitOfWork _unit { get; }
        public string UserId { get; set; }
        
        public ExamController(UnitOfWork unit)
        {
            _unit = unit;
        }

        [HttpGet("teacher")]
        [Authorize(Roles = "Teacher")]
        public async Task<IEnumerable<ExamDTO>> GetTeacherExams()
        {
            var UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var Exams =  await _unit.ExamRepository.GetAllExamsofTeacher(UserId);
            List<ExamDTO> ExamsDTO = new List<ExamDTO>();
            foreach (var item in Exams)
            {
                ExamDTO ExamDTO = new ExamDTO()
                {
                    Id = item.Id,
                    StartDate = item.StartDate,
                    Duration = item.Duration,
                    Title= item.Title,
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

        [HttpGet("{id}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetStudentExamDetails(int id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized("User ID not found.");

            var exam = await _unit.ExamRepository.GetAll().Result.FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null)
            {
                return NotFound($"Exam with ID {id} not found.");
            }

            DateTime currentTime = DateTime.Now;
            TimeZoneInfo egyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");
            DateTime egyptCurrentTime = TimeZoneInfo.ConvertTime(DateTime.UtcNow, TimeZoneInfo.Utc, egyptTimeZone);

            DateTime examEndDate = exam.StartDate + exam.Duration;

            if (egyptCurrentTime < exam.StartDate)
            {
                var examDto = new ExamDTO
                {
                    Id = exam.Id,
                    Title = exam.Title,
                    StartDate = exam.StartDate,
                    Duration = exam.Duration,
                    MaxDegree = exam.MaxDegree,
                    MinDegree = exam.MinDegree
                };
                return Ok(examDto);
            }
            else if (egyptCurrentTime >= exam.StartDate && egyptCurrentTime <= examEndDate)
            {
                var questionsForExam = await _unit.QuestionRepository.GetQuestionsWithOptions(id);
                var duringExamDto = new DuringExamDTO
                {
                    Id = exam.Id,
                    Title = exam.Title,
                    StartDate = exam.StartDate,
                    Duration = exam.Duration,
                    Questions = questionsForExam.Select(q => new QuestionForExamDTO
                    {
                        Id = q.Id,
                        Title = q.Title,
                        Degree = q.Degree,
                        Options = q.Options.Select(o => new OptionForExamDTO
                        {
                            Id = o.Id,
                            Title = o.Title,
                        }).ToList()
                    }).ToList()
                };
                return Ok(duringExamDto);
            }
            else
            {
                var studentExamRecord = await _unit.StudentExamRepository.GetByStudentAndExamAsync(currentUserId, id).FirstOrDefaultAsync();

                if (studentExamRecord == null)
                {
                    return Ok(new AfterExamEndDTO
                    {
                        Id = exam.Id,
                        Title = exam.Title,
                        StartDate = exam.StartDate,
                        Duration = exam.Duration,
                        MaxDegree = exam.MaxDegree,
                        MinDegree = exam.MinDegree,
                        IsAbsent = true,
                        stud_Options = new List<Stud_Option>(),
                        Options = new List<Option>()
                    });
                }

                var questionsWithAllOptions = await _unit.QuestionRepository.GetQuestionsWithOptions(id);

                var optionIdsForExam = questionsWithAllOptions
                    .SelectMany(q => q.Options)
                    .Select(o => o.Id)
                    .ToHashSet();

                var allStudentOptions = await _unit.StudentOptionRepository.GetAll();
                var studentSubmittedOptions = allStudentOptions
                    .Where(so => so.StudentId == currentUserId && optionIdsForExam.Contains(so.OptionId))
                    .ToList();

                var afterExamEndDto = new AfterExamEndDTO
                {
                    Id = exam.Id,
                    Title = exam.Title,
                    StartDate = exam.StartDate,
                    Duration = exam.Duration,
                    MaxDegree = exam.MaxDegree,
                    MinDegree = exam.MinDegree,
                    StudDegree = studentExamRecord.StudDegree,
                    IsAbsent = false,
                    stud_Options = studentSubmittedOptions,
                    Options = questionsWithAllOptions.SelectMany(q => q.Options).ToList()
                };
                return Ok(afterExamEndDto);
            }
        }

        [HttpPost]
        [Authorize(Roles ="Teacher")]
        public void AddExam([FromBody] Exam exam)
        {
            _unit.ExamRepository.Add(exam);
        }
        [HttpPut("{id}")]
        public void EditExam([FromBody] Exam exam)
        {
            _unit.ExamRepository.Update(exam.Id.ToString(),exam);
        }
        [HttpDelete("{id}")]
        public void RemoveExam(string Id)
        {
            _unit.ExamRepository.Delete(Id);
        }
        public void TakeExam(string ExamId)
        {
            if (UserId == null) return;
            _unit.ExamRepository.TakeExam(UserId, ExamId);
        }
        public void CloseExam(string ExamId)
        {
            if (UserId == null) return;
            _unit.ExamRepository.CloseExam(UserId, ExamId);
        }
        [HttpPost]
        [Authorize("Teacher")]
        public void AssignStudentsToExam(int ExamId, ICollection<string> studs_Id)
        {
            _unit.ExamRepository.AssignStudsToExam(ExamId, studs_Id);

        }
    }
}
