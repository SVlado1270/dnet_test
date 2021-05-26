using System.Threading.Tasks;

namespace Persistence.Interfaces
{
    public interface IRepositoryWrapper
    {
        IUserRepository User { get; }
        IRoomRepository Room { get; }
        IMessageRepository Message { get; }
        IItemRepository Item { get; }
        IBidRepository Bid { get; }
        Task SaveAsync();
    }
}
