using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Implementations
{
    public class StudentOptionRepository : GenericRepository<Stud_Option>, IStudentOptionRepository
    {
        readonly ExamSysContext _context;
        public StudentOptionRepository(ExamSysContext context) : base(context)
        {
            _context = context;
        }

    }
}