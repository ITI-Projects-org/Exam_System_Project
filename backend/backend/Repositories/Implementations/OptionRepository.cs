using backend.DTOs;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.Identity.Client;

namespace backend.Repositories.Implementations

{
    public class OptionRepository : GenericRepository<Option>, IOptionRepository
    {
        public OptionRepository(ExamSysContext context) : base(context)
        {
            
        }
        public async void RemoveRange(ICollection<Question> questions)
        {
            _context.Questions.RemoveRange(questions);
        }
        public void RemoveRange(ICollection<Option> options)
        {
            _context.Options.RemoveRange(options);
        }
        public void Update(Option option)
        {
             _context.Options.Update(option);
            
        }
        
    }
}
