using backend.DTOs;
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

        //public async Task<IEnumerable<Exam>> GetAllUserExams(string UserId)
        //{
        //    return _context.Exams.Where(e => e.TeacherId == Teacher_Id.ToString());

        //}
        public async Task<IEnumerable<Exam>> GetAllExamsofTeacher(string Teacher_Id)
        {
            return _context.Exams.Where(e => e.TeacherId == Teacher_Id.ToString());
        }

        public async Task<IEnumerable<Exam>> GetAllExamsofStudent(string Student_ID)
        {

            return _context.StudExams.Where(se => se.StudentId == Student_ID).Include(se => se.Exam).Select(se => se.Exam);
        }

        public async Task<Exam> TakeExam(string Student_ID, int ExamID)
        {
            // var stud_exam = await _context.StudExams.Where(se => se.StudentId == Student_ID && se.ExamId == ExamID).FirstOrDefaultAsync();
            // stud_exam.IsAbsent = false;
            // stud_exam.StudStartDate = DateTime.Now;
            // Exam? exam = await _context.Exams
            //     .Where(e => e.Id == ExamID)
            //     .Include(e => e.Questions)
            //     .ThenInclude(q => q.Options)
            //     .AsNoTracking()
            //     .FirstOrDefaultAsync();

            // return exam;
            var stud_exam = await _context.StudExams
                .FirstOrDefaultAsync(se => se.StudentId == Student_ID && se.ExamId == ExamID);

            if (stud_exam == null)
                return null;

            // If already taken, do not allow again
            if (!stud_exam.IsAbsent)
                return null;

            stud_exam.IsAbsent = false;
            stud_exam.StudStartDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return await _context.Exams.FindAsync(ExamID);
        }
        public async Task<Stud_Exam> GetStudentExamRecord(string studentId, int examId)
        {
            return await _context.StudExams
                .FirstOrDefaultAsync(se => se.StudentId == studentId && se.ExamId == examId);
        }
        public void CloseExam(string Student_ID, int ExamID)
        {
            var stud_exam = _context.StudExams.Where(se => se.StudentId == Student_ID && se.ExamId == ExamID).FirstOrDefault();
            stud_exam.StudEndDate = DateTime.Now;
        }

        public void AssignStudsToExam(int ExamId, ICollection<string> StudentsId)
        {
            List<Stud_Exam> studentExams = _context.StudExams.Where(se => se.ExamId == ExamId).ToList();
            _context.StudExams.RemoveRange(studentExams);
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
        public async Task<Exam> GetExamByIdWithWithQuestionsWithOptions(int ExamId)
        {
            return await _context.Exams
                .Where(e => e.Id == ExamId)
                .Include(e => e.Questions)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync();
        }
        public async Task<Exam> GetStudentExamById(string UserId, int examId)
        {
            return await _context.StudExams.
                Where(se => se.StudentId == UserId && se.ExamId == examId)
                .Include(se => se.Exam)
                .Select(se => se.Exam).FirstOrDefaultAsync();
        }
        public AfterExamEndDTO FillExamWithQuestionsWithOptionsDTO(AfterExamEndDTO AfterExam)
        {
            AfterExamEndDTO examDTO = new AfterExamEndDTO();
            examDTO.Id = AfterExam.Id;
            examDTO.StartDate = AfterExam.StartDate;
            examDTO.Duration = AfterExam.Duration;
            examDTO.Questions = new List<QuestionForExamDTO>();

            return examDTO;
        }


        public List<Student> GetAllExamStudents(int examId)
        {
            return _context.StudExams
                .Where(se => se.ExamId == examId)
                .Join(_context.Students, se => se.StudentId, s => s.Id, (se, s) => s)
                .ToList();
        }

        public void Remove(Exam exam)
        {
            _context.Exams.Remove(exam);
        }
        public async void Update(Exam exam)
        {
            _context.Exams.Update(exam);
        }

        Task IExamRepository.GetStudentExamRecord(string? studentId, int examId)
        {
            return GetStudentExamRecord(studentId, examId);
        }
    }
}