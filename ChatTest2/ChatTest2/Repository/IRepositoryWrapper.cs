using System.Threading.Tasks;

namespace Bidiots.Repository
{
    public interface IRepositoryWrapper
    {
        IUserRepository User { get; }
        IRoomRepository Room { get; }
        Task SaveAsync();
    }
}
