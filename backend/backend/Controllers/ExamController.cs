using System.Collections.Generic;
using System.Security.Claims;
using backend.DTOs;
using backend.Models;
using ELearning.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamController : ControllerBase
    {
        public UnitOfWork _unit { get; }
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

        // 3 cases (
        //  Before start exam DTO,
        //  During exam DTO (solve exam),
        //  After End Date DTO
        // )
        [HttpGet("{id}")]
        [ValidateAntiForgeryToken] 
        public async Task<Exam> GetExamById(int Id)
        {
            return _unit.ExamRepository.GetById(Id.ToString());
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
        //public void TakeExam(string ExamId)
        //{
            
        //}
    }
}
