using AutoMapper;
using Bidiots.Models;
using Bidiots.Repository;
using Bidiots.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
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

        public MessageHub(IRepositoryWrapper repositoryWrapper, IMapper mapper)
        {
            _repositoryWrapper = repositoryWrapper;
            _mapper = mapper;
        }

        public async Task CreateRoom(string roomName, string userName)
        {
            try
            {

                // Accept: Letters, numbers and one space between words.
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
                    // Create and save chat room in database
                    var user = _repositoryWrapper.User.FindByCondition(u => u.UserName == userName).FirstOrDefault();
                    var room = new Room()
                    {
                        Name = roomName,
                        OwnerId = user.Id
                    };
                    _repositoryWrapper.Room.CreateRoom(room);
                    await _repositoryWrapper.SaveAsync();

                    if (room != null)
                    {
                        // Update room list
                        var roomViewModel = _mapper.Map<Room, RoomViewModel>(room);
                        _Rooms.Add(roomViewModel);


                        //await Clients.All.SendAsync("addChatRoom", roomViewModel); -> sa apelezi functii de pe front
                    }
                }
                System.Console.WriteLine(_repositoryWrapper.Room.GetAllRoomsAsync());
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
                if (user != null && user.Room != roomName) //&& user.CurrentRoom != roomName)
                {
                    /*// Remove user from others list
                    if (!string.IsNullOrEmpty(user.CurrentRoom))
                        await Clients.OthersInGroup(user.CurrentRoom).SendAsync("removeUser", user);*/

                    // Join to new chat room
                    //await Leave(user.CurrentRoom);
                    await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
                    user.Room = roomName;

                    Console.WriteLine(user.Room);
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
                // Delete from database
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
    }
}
