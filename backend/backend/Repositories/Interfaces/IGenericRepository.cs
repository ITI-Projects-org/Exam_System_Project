namespace backend.Repositories.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAll();
        Task<IQueryable<T>> GetAllQueryable();
        Task<T> GetById(string Id);
        Task<T> GetById(int Id);
        Task<T> Add(T Entity);
        T Update(string Id, T Entity);
        Task Delete(string Id);
    }
}