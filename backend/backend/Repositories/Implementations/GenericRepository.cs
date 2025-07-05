using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        ExamSysContext _context;
        public GenericRepository(ExamSysContext context)
        {
            _context = context;
        }
        public async Task<IQueryable<T>> GetAll()
        {
            return _context.Set<T>().AsQueryable();
        }
       
        public async Task<T> GetById(string Id)
        {
            return _context.Set<T>().Find(Id);
        }

        public async Task<T> Add(T Entity)
        {
            _context.Set<T>().Add(Entity);
            return Entity;
        }

        public async void Delete(string Id)
        {
            _context.Set<T>().Remove(await GetById(Id));
        }

        public T Update(string Id, T Entity)
        {
            _context.Set<T>().Update(Entity);
            return Entity;
        }

      
    }
}
