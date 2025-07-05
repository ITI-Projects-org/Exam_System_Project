using AutoMapper;
using backend.DTOs;
using ELearning.UnitOfWorks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ActionConstraints;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherController : Controller

    {
        public TeacherController(UnitOfWork unit,IMapper map)
        {
            Unit = unit;
            Map = map;
        }

        public UnitOfWork Unit { get; }
        public IMapper Map { get; }
        [HttpGet]
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
        [HttpGet("byName/{name:alpha}")]
        public async Task< IActionResult> getStudentsBySearch (string name)
        {
            var sts = await Unit.TeacherRepository.getStudentsBySearch(name);
            return Ok(sts);
        }
        
        [HttpGet("{courseid:int}")]

        public async Task<IActionResult> getStudentsforCourse(int courseid)
        {
            var sts = await Unit.TeacherRepository.getStudentsforCourse(courseid);
            var srsDTO = Map.Map<List<StudentDTO>>(sts);

            return Ok(srsDTO);
        }
        [HttpGet("byStudent/{studentid:int}")]//byStudent عشان تبقى كل جت مميزة
        public async Task<IActionResult> getCoursesforStudent(int studentid)
        {
            var Crs = await Unit.TeacherRepository.getCoursesforStudent(studentid.ToString());
            return Ok(Crs);
        }
        
    }
}
