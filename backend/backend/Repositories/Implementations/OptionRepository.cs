using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations

{
    public class OptionRepository : GenericRepository<Option>, IOptionRepository
    {
        readonly ExamSysContext _context;
        public OptionRepository(ExamSysContext context) : base(context)
        {
            _context = context;
        }
    }
}
