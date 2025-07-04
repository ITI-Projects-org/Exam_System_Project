using backend.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace backend.Repositories.Interfaces
{
    public interface IStudentRepository : IGenericRepository<Student>
    {
        Task<Student> GetStudentWithDetails(string id);
        Task<IEnumerable<Student>> GetAllStudentsWithDetails();
    }
}