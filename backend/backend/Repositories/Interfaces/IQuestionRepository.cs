using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IQuestionRepository : IGenericRepository<Question>
    {
        Task<ICollection<Question>> GetQuestionsWithOptions(int ExamId);
    }
}