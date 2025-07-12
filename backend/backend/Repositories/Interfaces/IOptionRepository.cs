using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IOptionRepository : IGenericRepository<Option>
    {
        void RemoveRange(ICollection<Option> options);
        void Update (Option option);

       }
}