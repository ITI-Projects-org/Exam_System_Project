using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Implementations
{
    public class ExamRepository : GenericRepository<Exam>, IExamRepository
    {
        public ExamRepository(ExamSysContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Exam>> GetAllExamsofTeacher(string Teacher_Id)
        {
            return _context.Exams.Where(e => e.TeacherId == Teacher_Id.ToString());
        }

        public async Task<IEnumerable<Exam>> GetAllExamsofStudent(string Student_ID)
        {
         
            return _context.StudExams.Where(se => se.StudentId == Student_ID).Include(se=>se.Exam).Select(se=>se.Exam);
        }

        public async Task<Exam> TakeExam(string Student_ID, string ExamID)
        {
            var stud_exam = _context.StudExams.Where(se => se.StudentId == Student_ID).FirstOrDefault();
            stud_exam.IsAbsent = false;
            stud_exam.StudStartDate = DateTime.Now;
            Exam exam = _context.Exams.Where(e => e.Id.ToString() == ExamID).FirstOrDefault();
            return exam;
        }
        public void CloseExam(string Student_ID, string ExamID)
        {
            var stud_exam = _context.StudExams.Where(se => se.StudentId == Student_ID).FirstOrDefault();
            stud_exam.StudEndDate = DateTime.Now;
        }

        public void AssignStudsToExam(int ExamId, ICollection<string> StudentsId)
        {
            foreach (var StudentId in StudentsId)
            {
                Stud_Exam st_exam = new Stud_Exam()
                {
                    ExamId = ExamId,
                    StudentId = StudentId
                };
                _context.StudExams.Add(st_exam);
            }
        }

        public void AssignStudToExam(int ExamId, string StudentId)
        {
            Stud_Exam st_exam = new Stud_Exam()
            {
                ExamId = ExamId,
                StudentId = StudentId
            };
            _context.StudExams.Add(st_exam);
        }
    }
}