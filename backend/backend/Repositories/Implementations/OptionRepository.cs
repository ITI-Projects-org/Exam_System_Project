using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations

{
    public class OptionRepository : GenericRepository<Option>, IOptionRepository
    {
        public OptionRepository(ExamSysContext context) : base(context)
        {
        }
    }
}
