using Bidiots.Data;
using Microsoft.EntityFrameworkCore;
using Persistence.Interfaces;
using Persistence.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bidiots.Repository
{
    public class MessageRepository : RepositoryBase<Message>, IMessageRepository
    {
        public MessageRepository(DataContext dataContext)
    : base(dataContext)
        {
        }
        public void CreateMessage(Message message)
        {
            Create(message);
        }

        public void DeleteMessage(Message message)
        {
            Delete(message);
        }

        public async Task<IEnumerable<Message>> GetAllMessagesFromRoomAsync(string roomName)
        {
            return await FindByCondition(m => m.RoomName == roomName).ToListAsync();
        }

        public void UpdateMessage(Message message)
        {
            Update(message);
        }
    }
}
