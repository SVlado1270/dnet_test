using AutoMapper;
using Bidiots.Data;
using Bidiots.Mappings;
using Bidiots.Repository;
using Bidiots.ViewModels;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Persistence.Interfaces;
using Persistence.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Bidiots.Hubs
{
    public class MessageHub : Hub
    {
        public readonly static List<UserViewModel> _Connections = new List<UserViewModel>();
        public readonly static List<RoomViewModel> _Rooms = new List<RoomViewModel>();
        private readonly static Dictionary<string, string> _ConnectionsMap = new Dictionary<string, string>();

        protected readonly IMapper _mapper;
        protected readonly IRepositoryWrapper _repositoryWrapper;

        [ActivatorUtilitiesConstructor]
        public MessageHub(IRepositoryWrapper repositoryWrapper, IMapper mapper)
        {
            _repositoryWrapper = repositoryWrapper;
            _mapper = mapper;
        }

        public MessageHub(DataContext dataContext)
        {
            _repositoryWrapper = new RepositoryWrapper(dataContext);
            var messageMapper = new MessageMapper();
            var roomMapper = new RoomMapper();
            var userMapper = new UserMapper();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(messageMapper));
            configuration = new MapperConfiguration(cfg => cfg.AddProfile(roomMapper));
            configuration = new MapperConfiguration(cfg => cfg.AddProfile(userMapper));
            _mapper = new Mapper(configuration);
        }

        public async Task CreateRoom(string roomName, string userName)
        {
            try
            {
                Match match = Regex.Match(roomName, @"^\w+( \w+)*$");
                if (!match.Success)
                {
                    await Clients.Caller.SendAsync("onError", "Invalid room name!\nRoom name must contain only letters and numbers.");
                }
                else if (roomName.Length < 5 || roomName.Length > 100)
                {
                    await Clients.Caller.SendAsync("onError", "Room name must be between 5-100 characters!");
                }
                else if (_repositoryWrapper.Room.FindByCondition(r => r.Name == roomName).Any())
                {
                    await Clients.Caller.SendAsync("onError", "Another chat room with this name exists");
                }
                else
                {
                    var user = _repositoryWrapper.User.GetUserByNameAsync(userName).Result;
                    if (user == null)
                    {
                        await Clients.Caller.SendAsync("onError", "User not found");
                    }
                    else
                    {
                        var room = new Room()
                        {
                            Name = roomName,
                            OwnerId = user.Id
                        };
                        _repositoryWrapper.Room.CreateRoom(room);
                        await Clients.All.SendAsync("onCreateRoom",room);
                        await _repositoryWrapper.SaveAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("onError", "Couldn't create chat room: " + ex.Message);
            }
        }

        public async Task JoinRoom(string roomName, string userName)
        {
            try
            {
                var user = _repositoryWrapper.User.FindByCondition(u => u.UserName == userName).FirstOrDefault();
                var room = _repositoryWrapper.Room.FindByCondition(r => r.Name == roomName).FirstOrDefault();
                if (user != null && user.Room != roomName && room != null)
                {
                    /*// Remove user from others list
                    if (!string.IsNullOrEmpty(user.CurrentRoom))
                        await Clients.OthersInGroup(user.CurrentRoom).SendAsync("removeUser", user);*/

                    // Join to new chat room
                    //await Leave(user.CurrentRoom);
                    await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
                    user.Room = roomName;
                    _repositoryWrapper.User.UpdateUser(user);
                    await _repositoryWrapper.SaveAsync();

                    // Tell others to update their list of users
                    // await Clients.OthersInGroup(roomName).SendAsync("addUser", user); -> Ca sa actualizezi pe front interfata
                }
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("onError", "You failed to join the chat room!" + ex.Message);
            }
        }

        public async Task DeleteRoom(string roomName, string userName)
        {
            try
            {
                var user = _repositoryWrapper.User.FindByCondition(u => u.UserName == userName).FirstOrDefault();
                var room = _repositoryWrapper.Room.FindByCondition(r => r.Name == roomName && r.OwnerId == user.Id).FirstOrDefault();
                _repositoryWrapper.Room.DeleteRoom(room);
                await _repositoryWrapper.SaveAsync();


                // Move users back to Lobby
                //await Clients.Group(roomName).SendAsync("onRoomDeleted", string.Format("Room {0} has been deleted.\nYou are now moved to the Lobby!", roomName));

                // Tell all users to update their room list
                //await Clients.All.SendAsync("removeChatRoom", roomViewModel);
            }
            catch (Exception)
            {
                await Clients.Caller.SendAsync("onError", "Can't delete this chat room. Only owner can delete this room.");
            }
        }

        public async Task LeaveRoom(string roomName, string userName)
        {
            try
            {
                // Delete from database
                var user = _repositoryWrapper.User.FindByCondition(u => u.UserName == userName).FirstOrDefault();

                if (user.Room == roomName)
                {
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
                    user.Room = null;
                    _repositoryWrapper.User.UpdateUser(user);
                    await _repositoryWrapper.SaveAsync();
                }
                // Move users back to Lobby
                //await Clients.Group(roomName).SendAsync("onRoomDeleted", string.Format("Room {0} has been deleted.\nYou are now moved to the Lobby!", roomName));

                // Tell all users to update their room list
                //await Clients.All.SendAsync("removeChatRoom", roomViewModel);
            }
            catch (Exception)
            {
                await Clients.Caller.SendAsync("onError", "Can't delete this chat room. Only owner can delete this room.");
            }
        }

        public async Task<IEnumerable<Room>> GetActiveRooms()
        {
            return await _repositoryWrapper.Room.GetAllRoomsAsync();
        }

        public async Task<IEnumerable<Room>> GetUserRooms(string userName)
        {
            var user = _repositoryWrapper.User.FindByCondition(u => u.UserName == userName).FirstOrDefault();

            return await Task.FromResult(_repositoryWrapper.Room.FindByCondition(r => r.OwnerId == user.Id).ToList());
        }
    }
}
