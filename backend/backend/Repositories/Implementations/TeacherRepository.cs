using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class TeacherRepository : GenericRepository<Teacher>, ITeacherRepository
    {
        readonly ExamSysContext _context;
        public TeacherRepository(ExamSysContext context) : base(context)
        {
            _context = context;
        }
    }
}
