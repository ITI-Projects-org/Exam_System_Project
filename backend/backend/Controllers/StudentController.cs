using AutoMapper;
using backend.DTOs;
using backend.Models;
using backend.UnitOfWorks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
        public async Task<ActionResult<IEnumerable<StudentDTO>>> GetStudents()
        {
            var students = await _unitOfWork.StudentRepository.GetAllStudentsWithDetails();
            var studentDtos = _mapper.Map<List<StudentDTO>>(students);
            return Ok(studentDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StudentDTO>> GetStudent(string id)
        {
            var student = await _unitOfWork.StudentRepository.GetStudentWithDetails(id);

            if (student == null)
            {
                return NotFound();
            }

            var studentDto = _mapper.Map<StudentDTO>(student);
            return Ok(studentDto);
        }
    }
}