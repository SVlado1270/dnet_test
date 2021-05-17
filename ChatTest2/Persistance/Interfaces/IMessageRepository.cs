using Persistence.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Persistence.Interfaces
{
    public interface IMessageRepository : IRepositoryBase<Message>
    {
        Task<IEnumerable<Message>> GetAllMessagesFromRoomAsync(string roomName);
        void CreateMessage(Message message);
        void UpdateMessage(Message message);
        void DeleteMessage(Message message);
    }
}
