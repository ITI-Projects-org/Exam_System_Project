namespace backend.Repositories.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        IEnumerable<T> GetAll();
        T GetById(string Id);
        T Add(T Entity);
        T Update(string Id, T Entity);
        void Delete(string Id);
    }
}
