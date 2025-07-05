using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Implementations
{
    public class QuestionRepository : GenericRepository<Question>, IQuestionRepository
    {
        public QuestionRepository(ExamSysContext context) : base(context)
        {
        }

        public async Task<ICollection<Question>> GetQuestionsWithOptions(int ExamId)
        {
            return await _context.Questions.Where(e => e.Id == ExamId).Include(e => e.Options).ToListAsync();
        }
    }
}
