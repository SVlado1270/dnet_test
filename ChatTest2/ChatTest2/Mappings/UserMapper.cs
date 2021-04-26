using AutoMapper;
using Bidiots.ViewModels;
using Persistence.Models;

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
