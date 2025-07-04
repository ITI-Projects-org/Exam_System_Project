using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class StudentRepository : GenericRepository<Student>, IStudentRepository
    {
        readonly ExamSysContext _context;
        public StudentRepository(ExamSysContext context) : base(context)
        {
            _context = context;
        }
    }
}
