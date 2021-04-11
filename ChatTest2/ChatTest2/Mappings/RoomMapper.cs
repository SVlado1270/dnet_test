using AutoMapper;
using Bidiots.Models;
using Bidiots.ViewModels;

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
