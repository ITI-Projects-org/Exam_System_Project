using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class StudentExamRepository : GenericRepository<Stud_Exam>, IStudentExamRepository
    {
        public StudentExamRepository(ExamSysContext context) : base (context)
        {
        }

        public IQueryable<Stud_Exam> GetByStudentAndExamAsync(string StdId, int ExamId)
        {
            return _context.StudExams.Where(se => se.StudentId == StdId && se.ExamId == ExamId);
        }

        public IQueryable<Stud_Exam> GetAllQueryable()
        {
            return _context.StudExams.AsQueryable();
        }
    }
}
