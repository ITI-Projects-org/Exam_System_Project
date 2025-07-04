using System.Linq;
using backend.Models;
using backend.Repositories.Interfaces;


namespace backend.Repositories.Implementations
{
    public class ExamRepository : GenericRepository<Exam>, IExamRepository
    {
        private readonly ExamSysContext _context;
        public ExamRepository(ExamSysContext context) : base(context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Exam>> GetAllExamsofTeacher(string Teacher_Id) {
            return _context.Exams.Where(e => e.TeacherId == Teacher_Id.ToString());
        }
        public async Task<IEnumerable<Exam>> GetAllExamsofStudent(string Student_ID)
        {
            return _context.Exams.Join(_context.StudExams, e => e.Id, se => se.ExamId, (e, se) => e);
        }
        public async Task<Exam> TakeExam(string Student_ID, string ExamID)
        {
            var stud_exam = _context.StudExams.Where(se=>se.StudentId == Student_ID);
            stud_exam.
        }




    }
}
