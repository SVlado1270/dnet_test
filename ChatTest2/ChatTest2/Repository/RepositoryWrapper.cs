using Bidiots.Data;
using Persistence.Interfaces;
using System.Threading.Tasks;

namespace Bidiots.Repository
{
    public class RepositoryWrapper : IRepositoryWrapper
    {
        private readonly DataContext _dataContext;
        private IUserRepository _user;
        private IRoomRepository _room;
        public RepositoryWrapper(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public IUserRepository User
        {
            get
            {
                if (_user == null)
                {
                    _user = new UserRepository(_dataContext);
                }
                return _user;
            }
        }
        public IRoomRepository Room
        {
            get
            {
                if (_room == null)
                {
                    _room = new RoomRepository(_dataContext);
                }
                return _room;
            }
        }

        public async Task SaveAsync()
        {
            await _dataContext.SaveChangesAsync();
        }
    }
}
