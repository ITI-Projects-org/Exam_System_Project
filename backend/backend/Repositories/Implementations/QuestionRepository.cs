using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class QuestionRepository : GenericRepository<Question>, IQuestionRepository
    {
        readonly ExamSysContext _context;
        public QuestionRepository(ExamSysContext context) : base(context)
        {
            _context = context;
        }
    }
}
