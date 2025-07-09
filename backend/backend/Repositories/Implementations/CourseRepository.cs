using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class CourseRepository : GenericRepository<Course>, ICourseRepository
    {
        public CourseRepository(ExamSysContext context) : base(context)
        {
        }

        public async Task<List<Stud_Course>> AddRange(List<Stud_Course> entities)
        {
            await _context.Set<Stud_Course>().AddRangeAsync(entities);
            return (entities);
        }
    }
}
