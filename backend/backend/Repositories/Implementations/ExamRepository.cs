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
    }
}
