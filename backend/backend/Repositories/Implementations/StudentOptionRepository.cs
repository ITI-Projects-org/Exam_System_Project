using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class StudentOptionRepository : GenericRepository<Stud_Option>, IStudentOptionRepository
    {
        public StudentOptionRepository(ExamSysContext context) : base (context)
        {
        }
    }
}
