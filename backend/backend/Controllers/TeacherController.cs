using AutoMapper;
using backend.Models;
using backend.DTOs;
using backend.UnitOfWorks;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Teacher")]
    public class TeacherController : Controller
    {
        readonly IUnitOfWork Unit;
        readonly IMapper Map;

        public TeacherController(IUnitOfWork unit, IMapper map)
        {
            Unit = unit;
            Map = map;
        }

        [HttpGet]
        [Route("/api/Courses")]
        public async Task<IActionResult> GetCourses()
        {
            var courses = await Unit.CourseRepository.GetAll();

            return Ok(courses);
        }
        [HttpPost("AddCourse{courseName}")]

        public async Task<IActionResult> AddCourse(string courseName)
        {
            var TeacherId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            Course cr = new Course()
            {

                Name = courseName,
                TeacherId = TeacherId
            };
            Unit.CourseRepository.Add(cr);
            await Unit.SaveAsync();
            return Ok(cr);
        }
        [HttpPut("UpdateCourse")]

        public async Task<IActionResult> UpdateCourse([FromBody] UpdateCourseDto crDTO)
        {
            var TeacherId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            Course cr = await Unit.CourseRepository.GetById(crDTO.CourseId);
            if (cr == null) return NotFound();
            cr.Name = crDTO.CourseName;


            Unit.CourseRepository.Update(cr.Id.ToString(), cr);
            await Unit.SaveAsync();
            return Ok(cr);
        }
        [HttpPost("AssignCourses")]
        public async Task<IActionResult> AssignCourses([FromBody] CoursesAssignedToStudsDTO crsstudDTO)
        {
            List<Stud_Course> stud_Course = new List<Stud_Course>();

            foreach (var studID in crsstudDTO.StudentsIds)
            {
                foreach (var crsID in crsstudDTO.CourseIds)
                {

                    stud_Course.Add(new Stud_Course()
                    {

                        StudentId = studID,
                        CourseId = crsID

                    });
                }
            }
            await Unit.CourseRepository.AddRange(stud_Course);
            await Unit.SaveAsync();
            return Ok(stud_Course);




        }
        [HttpGet("findCourse/{search:alpha}")]
        public IActionResult getCoursesBySearch(string search)
        {
            var courses = Unit.TeacherRepository.getCoursesBySearch(search);

            return Ok(courses);
        }

        [HttpGet("byName/{name}")]
        public async Task<IActionResult> getStudentsBySearch(string name)
        {
            var sts = await Unit.TeacherRepository.getStudentsBySearch(name);
            return Ok(sts);
        }

        [HttpGet("{courseid:int}")]
        public async Task<IActionResult> getStudentsforCourse(int courseid)
        {
            var sts = await Unit.TeacherRepository.getStudentsforCourse(courseid);
            var stsDTO = Map.Map<List<StudentDTO>>(sts);

            return Ok(stsDTO);
        }

        [HttpGet("byStudent/{studentid:int}")]
        public async Task<IActionResult> getCoursesforStudent(int studentid)
        {
            var Crs = await Unit.TeacherRepository.getCoursesforStudent(studentid.ToString());
            return Ok(Crs);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllTeachers()
        {
            var teachers = await Unit.TeacherRepository.GetAll();
            var teachersDto = Map.Map<List<TeacherDTO>>(teachers);

            return Ok(teachersDto);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddTeacher(TeacherDTO teacherDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var teacher = Map.Map<Teacher>(teacherDto);
            await Unit.TeacherRepository.Add(teacher);
            await Unit.SaveAsync();

            return CreatedAtAction(nameof(AddTeacher), new { id = teacher.Id }, teacherDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeacher(string id, TeacherDTO teacherDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingTeacher = await Unit.TeacherRepository.GetById(id);
            if (existingTeacher == null)
                return NotFound();

            Map.Map(teacherDto, existingTeacher);

            Unit.TeacherRepository.Update(id, existingTeacher);
            await Unit.SaveAsync();

            return NoContent();
        }

    }
}