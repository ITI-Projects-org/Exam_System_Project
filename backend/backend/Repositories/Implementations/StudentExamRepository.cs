using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Implementations
{
    public class StudentExamRepository : GenericRepository<Stud_Exam>, IStudentExamRepository
    {
        readonly ExamSysContext _context;
        public StudentExamRepository(ExamSysContext context) : base(context)
        {
            _context = context;
        }
        public IQueryable<Stud_Exam> GetByStudentAndExamAsync(string StdId, int ExamId)
        {
           return  _context.StudExams.Where(se=>se.StudentId == StdId && se.ExamId== ExamId);
        }
    }
}