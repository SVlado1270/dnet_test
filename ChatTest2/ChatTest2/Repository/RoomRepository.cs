using Bidiots.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bidiots.Repository
{
    public class RoomRepository : RepositoryBase<Room>, IRoomRepository
    {
        public RoomRepository(DataContext dataContext)
    : base(dataContext)
        {
        }
        public async Task<IEnumerable<Room>> GetAllRoomsAsync()
        {
            return await FindAll()
               .ToListAsync();
        }
        public async Task<Room> GetRoomByIdAsync(Guid guid)
        {
            return await FindByCondition(room => room.Id.Equals(guid))
                .FirstOrDefaultAsync();
        }
        public async Task<Room> GetRoomByNameAsync(string roomName)
        {
            return await FindByCondition(room => room.Name.Equals(roomName))
                .FirstOrDefaultAsync();
        }
        public async Task<Room> GetRoomWithDetailsAsync(Guid guid)
        {
            return await FindByCondition(room => room.Id.Equals(guid))
                .FirstOrDefaultAsync();
        }
        public void CreateRoom(Room room)
        {
            Create(room);
        }
        public void UpdateRoom(Room room)
        {
            Update(room);
        }
        public void DeleteRoom(Room room)
        {
            Delete(room);
        }
    }
}
