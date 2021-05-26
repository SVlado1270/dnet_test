using Persistence.Models;

namespace Persistence.Interfaces
{
    public interface IBidRepository : IRepositoryBase<Bid>
    {
        void CreateBid(Bid bid);
        void UpdateBid(Bid bid);
        void DeleteBid(Bid bid);
    }
}
