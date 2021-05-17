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
        private IMessageRepository _message;
        private IItemRepository _item;
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
        public IMessageRepository Message
        {
            get
            {
                if (_message == null)
                {
                    _message = new MessageRepository(_dataContext);
                }
                return _message;
            }
        }
        public IItemRepository Item
        {
            get
            {
                if (_item == null)
                {
                    _item = new ItemRepository(_dataContext);
                }
                return _item;
            }
        }
        public async Task SaveAsync()
        {
            await _dataContext.SaveChangesAsync();
        }
    }
}
