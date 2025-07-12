using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Implementations
{
    public class StudentExamRepository : GenericRepository<Stud_Exam>, IStudentExamRepository
    {
        public StudentExamRepository(ExamSysContext context) : base(context)
        {
        }

        public Stud_Exam GetByStudentAndExamAsync(string StdId, int ExamId)
        {
            return _context.StudExams.Where(se => se.StudentId == StdId && se.ExamId == ExamId).FirstOrDefault();
        }

        public IQueryable<Stud_Exam> GetAllQueryable()
        {
            return _context.StudExams.AsQueryable();
        }

        public async Task UpdateAsync(Stud_Exam studExam) // Changed method signature to return Task
        {
            _context.StudExams.Update(studExam); // Removed await as Update is not an async method
            //await _context.SaveChangesAsync(); // Save changes asynchronously
        }

      
    }
}
