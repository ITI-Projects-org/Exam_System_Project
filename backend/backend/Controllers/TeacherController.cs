using AutoMapper;
using backend.DTOs;
using backend.UnitOfWorks;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherController : Controller
    {
        public IUnitOfWork Unit { get; }
        public IMapper Map { get; }

        public TeacherController(IUnitOfWork unit, IMapper map)
        {
            Unit = unit;
            Map = map;
        }

        [HttpGet]
        [Route("/api/Courses")]
        public IActionResult getCourses()
        {
            var courses = Unit.TeacherRepository.getCourses();

            return Ok(courses);
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

        [HttpGet("byStudent/{studentid:int}")] //byStudent عشان تبقى كل جت مميزة
        public async Task<IActionResult> getCoursesforStudent(int studentid)
        {
            var Crs = await Unit.TeacherRepository.getCoursesforStudent(studentid.ToString());
            return Ok(Crs);
        }
    }
}