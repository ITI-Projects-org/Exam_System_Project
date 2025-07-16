using AutoMapper;
using backend.DTOs;
using backend.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/Students")]
    [ApiController]
    [Authorize(Roles = "Teacher")]
    public class StudentController : ControllerBase
    {
        readonly IUnitOfWork _unitOfWork;
        readonly IMapper _mapper;

        public StudentController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentDetailsDTO>>> GetStudents()
        {
            var students = await _unitOfWork.StudentRepository.GetAllStudentsWithDetails();
            var studentDtos = _mapper.Map<List<StudentDetailsDTO>>(students);
            return Ok(studentDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StudentDetailsDTO>> GetStudent(string id)
        {
            var student = await _unitOfWork.StudentRepository.GetStudentWithDetails(id);

            if (student == null)
            {
                return NotFound();
            }

            var studentDto = _mapper.Map<StudentDetailsDTO>(student);
            return Ok(studentDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<StudentDetailsDTO>> UpdateStudent(string id, StudentDetailsDTO studentDto)
        {
            if (id != studentDto.Id)
            {
                return BadRequest("ID mismatch");
            }

            var existingStudent = await _unitOfWork.StudentRepository.GetById(id);
            if (existingStudent == null)
            {
                return NotFound();
            }

            _mapper.Map(studentDto, existingStudent);
            _unitOfWork.StudentRepository.Update(id, existingStudent);
            await _unitOfWork.SaveAsync();

            var updatedStudentDto = _mapper.Map<StudentDetailsDTO>(existingStudent);
            return Ok(updatedStudentDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(string id)
        {
            var student = await _unitOfWork.StudentRepository.GetById(id);
            if (student == null)
            {
                return NotFound();
            }

            _unitOfWork.StudentRepository.Delete(id);
            await _unitOfWork.SaveAsync();

            return NoContent();
        }

        /*
         1.	Add PUT endpoint to update student
            •	Validate ID exists in route
            •	Check if student exists
            •	Map updated DTO to entity
            •	Update in repository
            •	Return updated student DTO
         2.	Add DELETE endpoint to delete student
            •	Validate ID exists
            •	Check if student exists
            •	Delete from repository
            •	Return success response
         */

    }
}