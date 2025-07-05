using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Implementations
{
    public class QuestionRepository : GenericRepository<Question>, IQuestionRepository
    {
        private readonly ExamSysContext _context;
        public QuestionRepository(ExamSysContext context) : base(context)
        {
            _context = context;
        }
        public async Task <ICollection<Question>> GetQuestionsWithOptions(int ExamId)
        {
            return await _context.Questions.Where(e => e.Id == ExamId).Include(e => e.Options).ToListAsync();
        }
    }
}
