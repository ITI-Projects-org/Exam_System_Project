using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Implementations
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly ExamSysContext _context;
        public GenericRepository(ExamSysContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<T>> GetAll()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public async Task<IQueryable<T>> GetAllQueryable()
        {
            return _context.Set<T>().AsQueryable();
        }

        public async Task<T> GetById(string Id)
        {
            return await _context.Set<T>().FindAsync(Id);
        }

        // For int primary keys
        public async Task<T> GetById(int Id)
        {
            return await _context.Set<T>().FindAsync(Id);
        }

        public async Task<T> Add(T Entity)
        {
            await _context.Set<T>().AddAsync(Entity);
            return Entity;
        }

        public async Task<List<T>> AddRange(List<T> entities)
        {
            await _context.Set<T>().AddRangeAsync(entities);
            return (entities);
        }

        public T Update(string Id, T Entity)
        {
            _context.Set<T>().Update(Entity);
            return Entity;
        }

        public async void Delete(string Id)
        {
            var entity = await GetById(Id);
            if (entity != null)
            {
                _context.Set<T>().Remove(entity);
            }
        }
    }
}