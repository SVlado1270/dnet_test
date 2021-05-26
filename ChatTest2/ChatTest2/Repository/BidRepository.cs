using Bidiots.Data;
using Persistence.Interfaces;
using Persistence.Models;

namespace Bidiots.Repository
{
    public class BidRepository : RepositoryBase<Bid>, IBidRepository
    {
        public BidRepository(DataContext dataContext)
    : base(dataContext)
        {
        }
        public void CreateBid(Bid bid)
        {
            Create(bid);
        }

        public void DeleteBid(Bid bid)
        {
            Delete(bid);
        }

        public void UpdateBid(Bid bid)
        {
            Update(bid);
        }
    }
}
