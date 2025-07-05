using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Implementations
{
    public class TeacherRepository : GenericRepository<Teacher>, ITeacherRepository
    {
        readonly ExamSysContext _context;
        public TeacherRepository(ExamSysContext context) : base(context)
        {
            _context = context;
        }

        public List<Course> getCourses()
        {
            return _context.Courses.ToList();
        }

        public List<Course> getCoursesBySearch(string crs)
        {
            return _context.Courses.Where(c => c.Name.Contains(crs)).ToList();
        }


        public async Task<List<Course>> getCoursesforStudent(string studentId)
        {
            return await _context.StudCourses.Where(s => s.StudentId.ToString() == studentId).Select(s => s.Course).ToListAsync();
        }

        public async Task<List<Student>> getStudentsBySearch(string studs)
        {
            return await _context.Students.Where(s => (s.FirstName + " " + s.LastName).Contains(studs)).ToListAsync();
        }

        public async Task<List<Student>> getStudentsforCourse(int courseId)
        {
            return await _context.StudCourses.Where(s => s.CourseId == courseId).Select(s => s.Student).ToListAsync();
        }
    }
}
