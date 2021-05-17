using Bidiots.Data;
using Persistence.Interfaces;
using Persistence.Models;

namespace Bidiots.Repository
{
    public class ItemRepository : RepositoryBase<Item>, IItemRepository
    {
        public ItemRepository(DataContext dataContext)
    : base(dataContext)
        {
        }
        public void CreateItem(Item item)
        {
            Create(item);
        }

        public void DeleteItem(Item item)
        {
            Delete(item);
        }

        public void UpdateItem(Item item)
        {
            Update(item);
        }
    }
}
