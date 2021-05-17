using AutoMapper;
using Bidiots.ViewModels;
using Persistence.Models;

namespace Bidiots.Mappings
{
    public class MessageMapper : Profile
    {
        public MessageMapper()
        {
            CreateMap<Message, MessageViewModel>()
                .ForMember(dst => dst.From, opt => opt.MapFrom(x => x.UserId))
                .ForMember(dst => dst.To, opt => opt.MapFrom(x => x.RoomName))
                .ForMember(dst => dst.Content, opt => opt.MapFrom(x => x.Content));
            CreateMap<MessageViewModel, Message>();
        }
    }
}
