using backend.Models;
using backend.Repositories.Implementations;
using backend.Repositories.Interfaces;

namespace backend.UnitOfWorks
{
    public class UnitOfWork : IUnitOfWork
    {
        readonly ExamSysContext _context;
        public UnitOfWork(ExamSysContext context)
        {
            _context = context;
        }

        IStudentRepository _studentRepository;
        ITeacherRepository _teacherRepository;
        IExamRepository _examRepository;
        IQuestionRepository _questionRepository;
        IOptionRepository _optionRepository;
        ICourseRepository _courseRepository;

        public IStudentRepository StudentRepository
        {
            get
            {
                if (_studentRepository == null) _studentRepository = new StudentRepository(_context);
                return _studentRepository;
            }
        }
        public ITeacherRepository TeacherRepository
        {
            get
            {
                if (_teacherRepository == null) _teacherRepository = new TeacherRepository(_context);
                return _teacherRepository;
            }
        }
        public IExamRepository ExamRepository
        {
            get
            {
                if (_examRepository == null) _examRepository = new ExamRepository(_context);
                return _examRepository;
            }
        }
        public IQuestionRepository QuestionRepository
        {
            get
            {
                if (_questionRepository == null) _questionRepository = new QuestionRepository(_context);
                return _questionRepository;
            }
        }
        public IOptionRepository OptionRepository
        {
            get
            {
                if (_optionRepository == null) _optionRepository = new OptionRepository(_context);
                return _optionRepository;
            }
        }
        public ICourseRepository CourseRepository
        {
            get
            {
                if (_courseRepository == null) _courseRepository = new CourseRepository(_context);
                return _courseRepository;
            }
        }

        public async Task SaveAsync() // Changed to async
        {
            await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}