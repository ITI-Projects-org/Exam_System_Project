using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class CourseRepository : GenericRepository<Course>, ICourseRepository
    {
        readonly ExamSysContext _context;
        public CourseRepository(ExamSysContext context) : base(context)
        {
            _context = context;
        }
    }
}
