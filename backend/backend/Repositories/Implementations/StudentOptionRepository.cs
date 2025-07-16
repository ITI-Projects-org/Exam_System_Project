using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.Identity.Client;

namespace backend.Repositories.Implementations
{
    public class StudentOptionRepository : GenericRepository<Stud_Option>, IStudentOptionRepository
    {
        public StudentOptionRepository(ExamSysContext context) : base (context)
        {
            
        }
        public async Task<List<Stud_Option>> GetAllStudentOptions(string StdId)
        {
            return _context.StudOptions.Where(so => so.StudentId == StdId).ToList();
        }
        public async void AddRange(List<Stud_Option> stdOptions)
        {
            _context.StudOptions.AddRange(stdOptions);
        }
    }
}
