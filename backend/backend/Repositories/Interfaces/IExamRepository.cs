using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IExamRepository : IGenericRepository<Exam>
    {
        Task<IEnumerable<Exam>> GetAllExamsofTeacher(string Teacher_Id);
        Task<IEnumerable<Exam>> GetAllExamsofStudent(string Student_ID);
    }
}