using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IStudentExamRepository : IGenericRepository<Stud_Exam>
    {
        public IQueryable<Stud_Exam> GetByStudentAndExamAsync(string StdId, int ExamId);
        public IQueryable<Stud_Exam> GetAllQueryable();
        public Task UpdateAsync(Stud_Exam studExam);

    }
}