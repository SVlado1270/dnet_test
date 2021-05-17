using Persistence.Models;

namespace Persistence.Interfaces
{
    public interface IItemRepository : IRepositoryBase<Item>
    {
        void CreateItem(Item item);
        void UpdateItem(Item item);
        void DeleteItem(Item item);
    }
}
