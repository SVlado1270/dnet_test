using AutoMapper;
using Bidiots.ViewModels;
using Persistence.Models;

namespace Bidiots.Mappings
{
    public class RoomMapper: Profile
    {
        public RoomMapper()
        {
            CreateMap<Room, RoomViewModel>();
            CreateMap<RoomViewModel, Room>();
        }
    }
}
