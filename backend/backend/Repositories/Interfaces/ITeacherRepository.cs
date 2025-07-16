using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface ITeacherRepository : IGenericRepository<Teacher>
    {
        Task<List<Student>> getStudentsBySearch(string studs);
        List<Course> getCoursesBySearch(string crs);
        Task<List<Student>> getStudentsforCourse(int courseId);
        Task<List<Course>> getCoursesforStudent(string studentId);
    }
}