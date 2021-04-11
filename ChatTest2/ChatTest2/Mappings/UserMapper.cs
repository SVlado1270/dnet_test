

using AutoMapper;
using Bidiots.Models;
using Bidiots.ViewModels;

namespace Bidiots.Mappings
{
    public class UserMapper : Profile
    {
        public UserMapper()
        {
            CreateMap<User, UserViewModel>()
                   .ForMember(dst => dst.Username, opt => opt.MapFrom(x => x.UserName));
            CreateMap<UserViewModel, User>();

        }
    }
}
