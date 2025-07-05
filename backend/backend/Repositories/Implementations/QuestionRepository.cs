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
        public async Task<Exam> GetExamWithQuestionsWithOptions(int ExamId)
        {
            return await _context.Exams
                        .Include(e => e.Questions)
                            .ThenInclude(q => q.Options)
                        .FirstOrDefaultAsync(e => e.Id == ExamId);
        }
    }
}
