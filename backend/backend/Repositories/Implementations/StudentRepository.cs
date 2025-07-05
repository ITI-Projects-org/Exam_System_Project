using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Implementations
{
    public class StudentRepository : GenericRepository<Student>, IStudentRepository
    {
        private readonly ExamSysContext _context;
        public StudentRepository(ExamSysContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Student> GetStudentWithDetails(string id)
        {
            return await _context.Students
                                .Include(s => s.StudCourses)
                                    .ThenInclude(sc => sc.Course)
                                .Include(s => s.StudExams)
                                    .ThenInclude(se => se.Exam)
                                .Include(s => s.StudOptions)
                                    .ThenInclude(so => so.Option)
                                        .ThenInclude(o => o.Question)
                                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<Student>> GetAllStudentsWithDetails()
        {
            return await _context.Students
                                    .Include(s => s.StudCourses)
                                        .ThenInclude(sc => sc.Course)
                                    .Include(s => s.StudExams)
                                        .ThenInclude(se => se.Exam)
                                    .Include(s => s.StudOptions)
                                        .ThenInclude(so => so.Option)
                                            .ThenInclude(o => o.Question)
                                    .ToListAsync();
        }
    }
}
