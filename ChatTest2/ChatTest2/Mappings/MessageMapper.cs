﻿using AutoMapper;
using Bidiots.Models;
using Bidiots.ViewModels;

namespace Bidiots.Mappings
{
    public class MessageMapper : Profile
    {
        public MessageMapper()
        {
            CreateMap<Message, MessageViewModel>()
                .ForMember(dst => dst.From, opt => opt.MapFrom(x => x.User.Id))
                .ForMember(dst => dst.To, opt => opt.MapFrom(x => x.ToRoom.Name))
                .ForMember(dst => dst.Content, opt => opt.MapFrom(x => x.Content));
            CreateMap<MessageViewModel, Message>();
        }
    }
}
