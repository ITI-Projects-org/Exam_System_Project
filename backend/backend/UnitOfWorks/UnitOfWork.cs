using backend.Models;
using backend.Repositories.Implementations;

namespace ELearning.UnitOfWorks
{
    public class UnitOfWork
    {
        private ExamSysContext _context;
        public UnitOfWork(ExamSysContext context)
        {
            _context = context;
        }
        private StudentRepository studentRepository;
        private TeacherRepository teacherRepository;
        private ExamRepository examRepository;
        private QuestionRepository questionRepository;
        private OptionRepository optionRepository;
        private CourseRepository courseRepository;

        public CourseRepository CourseRepository
        {
            get
            {
                if (courseRepository == null) courseRepository = new CourseRepository(_context);
                return courseRepository;
            }
        }
        public OptionRepository OptionRepository
        {
            get
            {
                if (optionRepository == null) optionRepository = new OptionRepository(_context);
                return optionRepository;
            }
        }
        public QuestionRepository QuestionRepository
        {
            get
            {
                if (questionRepository == null) questionRepository = new QuestionRepository(_context);
                return questionRepository;
            }
        }
        public ExamRepository ExamRepository
        {
            get
            {
                if (examRepository == null) examRepository = new ExamRepository(_context);
                return examRepository;
            }
        }
        public TeacherRepository TeacherRepositoryRepository
        {
            get
            {
                if (teacherRepository == null) teacherRepository = new TeacherRepository(_context);
                return teacherRepository;
            }
        }
        public StudentRepository StudentRepository
        {
            get
            {
                if (studentRepository == null) studentRepository = new StudentRepository(_context);
                return studentRepository;
            }
        }
        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
