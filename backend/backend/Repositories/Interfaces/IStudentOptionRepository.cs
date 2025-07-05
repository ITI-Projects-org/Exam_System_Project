using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IStudentOptionRepository : IGenericRepository<Stud_Option>
    {
        Task<List<Stud_Option>> GetAllStudentOptions(string StdId);

    }
}