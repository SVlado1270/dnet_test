using System.Threading.Tasks;

namespace Persistence.Interfaces
{
    public interface IRepositoryWrapper
    {
        IUserRepository User { get; }
        IRoomRepository Room { get; }
        Task SaveAsync();
    }
}
