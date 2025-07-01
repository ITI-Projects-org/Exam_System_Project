using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class CourseRepository : GenericRepository<Course>, ICourseRepository
    {
        private readonly ExamSysContext _context;
        public CourseRepository(ExamSysContext context) : base(context)
        {
            _context = context;
        }
    }
}
