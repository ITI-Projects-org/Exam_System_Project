namespace backend.Repositories.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        IEnumerable<T> GetAll();
        T GetById(int Id);
        T Add(int Id, T Entity);
        T Update(int Id, T Entity);
        void Delete(int Id);
    }
}
