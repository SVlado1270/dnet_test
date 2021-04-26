using Persistence.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Persistence.Interfaces
{
    public interface IRoomRepository : IRepositoryBase<Room>
    {
        Task<IEnumerable<Room>> GetAllRoomsAsync();
        Task<Room> GetRoomByIdAsync(Guid guid);
        Task<Room> GetRoomByNameAsync(string roomName);
        Task<Room> GetRoomWithDetailsAsync(Guid guid);
        void CreateRoom(Room room);
        void UpdateRoom(Room room);
        void DeleteRoom(Room room);
    }
}
