using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IStudentRepository : IGenericRepository<Student>
    {
        Task<Student> GetStudentWithDetails(string id);
        Task<IEnumerable<Student>> GetAllStudentsWithDetails();
        Task DeleteStudent(string id);
    }
}