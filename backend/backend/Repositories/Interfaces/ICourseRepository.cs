using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface ICourseRepository : IGenericRepository<Course>
    {
        Task<List<Stud_Course>> AddRange(List<Stud_Course> entities);
    }
}