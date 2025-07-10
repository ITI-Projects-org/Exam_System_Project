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
    //[Authorize(Roles ="Teacher")]
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
        [Route("GetCourses")]
        public async Task<IActionResult> GetCourses()
        {
            var courses = await Unit.CourseRepository.GetAll();

            return Ok(courses);
        }
        [HttpPost("AddCourse")]

        public async Task<IActionResult> AddCourse([FromBody]string courseName)
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
        public async Task<IActionResult> AssignCourses([FromBody] CoursesAssignedToStudsDTO crsstudDTO) {
            List<Stud_Course> stud_Course = new List<Stud_Course>();

            foreach (var studID in crsstudDTO.StudentsIds)
            {
                foreach (var crsID in crsstudDTO.CoursesIds)
                {

                    stud_Course.Add(new Stud_Course() {

                        StudentId = studID,
                        CourseId = crsID

                    });
                }
            }
            await Unit.CourseRepository.AddRange(stud_Course);
            await Unit.SaveAsync();
            return Ok(stud_Course);




        }
        [HttpGet("GetCoursesBySearch/{search:alpha}")]
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

        [HttpGet("GetStudentsforCourse/{courseid:int}")]
        public async Task<IActionResult> getStudentsforCourse(int courseid)
        {
            var sts = await Unit.TeacherRepository.getStudentsforCourse(courseid);
            var stsDTO = Map.Map<List<StudentDTO>>(sts);

            return Ok(stsDTO);
        }

        [HttpGet("GetCoursesforStudent/{studentid:int}")] //byStudent عشان تبقى كل جت مميزة
        public async Task<IActionResult> getCoursesforStudent(int studentid)
        {
            var Crs = await Unit.TeacherRepository.getCoursesforStudent(studentid.ToString());
            return Ok(Crs);
        }

        [HttpGet("GetAllTeachers")]
        public async Task<IActionResult> GetAllTeachers()
        {
            var teachers = await Unit.TeacherRepository.GetAll();
            var teachersDto = Map.Map<List<TeacherDTO>>(teachers);

            return Ok(teachersDto);
        }

        [HttpPost("AddTeacher")]
        public async Task<IActionResult> AddTeacher([FromBody]TeacherDTO teacherDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var teacher = Map.Map<Teacher>(teacherDto);
            await Unit.TeacherRepository.Add(teacher);
            await Unit.SaveAsync();

            return CreatedAtAction(nameof(AddTeacher), new { id = teacher.Id }, teacherDto);
        }

        [HttpPut("UpdateTeacher/{id}")]
        public async Task<IActionResult> UpdateTeacher(string id,[FromBody] TeacherDTO teacherDto)
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