using AutoMapper;
using Bidiots.Data;
using Bidiots.Entities;
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

        public async Task CreateRoom(RoomModel roomModel, ItemModel itemModel)
        {
            try
            {
                Match match = Regex.Match(roomModel.RoomName, @"^\w+( \w+)*$");
                if (!match.Success)
                {
                    await Clients.Caller.SendAsync("onCreateRoomError", "Invalid room name!\nRoom name must contain only letters and numbers.");
                }
                else if (roomModel.RoomName.Length < 5 || roomModel.RoomName.Length > 100)
                {
                    await Clients.Caller.SendAsync("onCreateRoomError", "Room name must be between 5-100 characters!");
                }
                else if (_repositoryWrapper.Room.FindByCondition(r => r.Name == roomModel.RoomName).Any())
                {
                    await Clients.Caller.SendAsync("onCreateRoomError", "Another chat room with this name exists");
                }
                else
                {
                    var user = _repositoryWrapper.User.GetUserByNameAsync(roomModel.UserName).Result;
                    if (user == null)
                    {
                        await Clients.Caller.SendAsync("onCreateRoomError", "User not found");
                    }
                    else
                    {
                        var item = new Item
                        {
                            Name = itemModel.Name,
                            URL = itemModel.URL,
                            Description = itemModel.Description,
                            Category = itemModel.Category,
                            OwnerId = user.Id
                        };
                        _repositoryWrapper.Item.CreateItem(item);
                        await _repositoryWrapper.SaveAsync();
                        var itemFromDb = _repositoryWrapper.Item.FindByCondition(i =>i.Name == itemModel.Name).FirstOrDefault();
                        var bid = new Bid
                        {
                            ItemId = itemFromDb.Id,
                            Amount = 0,
                            BidTime = ""
                        };

                        _repositoryWrapper.Bid.CreateBid(bid);
                        await _repositoryWrapper.SaveAsync();
                        var room = new Room
                        {
                            Name = roomModel.RoomName,
                            OwnerId = user.Id,
                            Category = roomModel.Category,
                            ItemId = itemFromDb.Id,
                            StartTime = roomModel.StartTime
                        };
                        _repositoryWrapper.Room.CreateRoom(room);
                        await _repositoryWrapper.SaveAsync();
                        await Clients.All.SendAsync("onCreateRoom", room);
                        await Clients.Caller.SendAsync("onCreateRoomSuccess", "Room was created successfully");
                    }
                }
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("onCreateRoomError", "Couldn't create chat room: " + ex.Message);
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
                    await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
                    user.Room = roomName;
                    _repositoryWrapper.User.UpdateUser(user);
                    await _repositoryWrapper.SaveAsync();
                    await Clients.OthersInGroup(roomName).SendAsync("addUser", user);
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
                _repositoryWrapper.User.FindByCondition(u => u.Room == roomName).ToList().ForEach(async u => await LeaveRoom(roomName, u.UserName));
                _repositoryWrapper.Room.DeleteRoom(room);
                await _repositoryWrapper.SaveAsync();
                await Clients.Group(roomName).SendAsync("onRoomDeleted", string.Format("Room {0} has been deleted.\nYou are now moved to the Lobby!", roomName));
                await Clients.All.SendAsync("removeChatRoom");
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
                var user = _repositoryWrapper.User.FindByCondition(u => u.UserName == userName).FirstOrDefault();
                if (user.Room == roomName)
                {
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
                    user.Room = null;
                    _repositoryWrapper.User.UpdateUser(user);
                    await _repositoryWrapper.SaveAsync();
                }
                await Clients.Caller.SendAsync("leftRoom");
                await Clients.Group(roomName).SendAsync("onUserLeave", "User left");
            }
            catch (Exception)
            {
                await Clients.Caller.SendAsync("onError", "Error leaving room");
            }
        }

        public async Task SendMessageToRoom(string roomName, string userName, string message)
        {
            try
            {
                var user = _repositoryWrapper.User.FindByCondition(u => u.UserName == userName).FirstOrDefault();
                var room = _repositoryWrapper.Room.FindByCondition(r => r.Name == roomName).FirstOrDefault();
                if (user != null && room != null)
                {
                    _repositoryWrapper.Message.Create(new Message { RoomName = roomName, Content = message, UserName = user.UserName, UserId = user.Id });
                    await _repositoryWrapper.SaveAsync();
                }
                await Clients.OthersInGroup(roomName).SendAsync("onMessageSend", message);
                await Clients.Caller.SendAsync("onMessageSendSuccess", roomName);

            }
            catch (Exception)
            {
                await Clients.Caller.SendAsync("onError", "Error on sending message");
            }
        }

        public async Task BidOnItem(string roomName, string userName, int amount, string timestamp)
        {
            try
            {
                var user = _repositoryWrapper.User.FindByCondition(u => u.UserName == userName).FirstOrDefault();
                var room = _repositoryWrapper.Room.FindByCondition(r => r.Name == roomName).FirstOrDefault();
                var bid = _repositoryWrapper.Bid.FindByCondition(b => b.ItemId == room.ItemId).FirstOrDefault();

                if (user != null && room != null && bid != null)
                {
                    bid.BidTime = timestamp;
                    bid.Amount = amount;
                    _repositoryWrapper.Bid.Update(bid);
                    await _repositoryWrapper.SaveAsync();
                    await Clients.Group(roomName).SendAsync("WasBidOnItem", userName, amount, timestamp);
                }
            }
            catch (Exception)
            {
                await Clients.Caller.SendAsync("onError", "Error on sending message");
            }
        }

        public async Task UpdateItem(string roomName, string userName)
        {
            try
            {
                var user = _repositoryWrapper.User.FindByCondition(u => u.UserName == userName).FirstOrDefault();
                var room = _repositoryWrapper.Room.FindByCondition(r => r.Name == roomName).FirstOrDefault();
                var item = _repositoryWrapper.Item.FindByCondition(i => i.Id == room.ItemId).FirstOrDefault();
                item.OwnerId = user.Id;
                if (user != null && item != null)
                {
                    _repositoryWrapper.Item.Update(item);
                    await _repositoryWrapper.SaveAsync();
                    await Clients.Group(roomName).SendAsync("UpdatedItem", string.Format("User {0} won auction", userName), userName);

                    // _repositoryWrapper.User.FindByCondition(u => u.Room == roomName).ToList().ForEach(async u => await LeaveRoom(roomName, u.UserName));
                }
            }
            catch (Exception)
            {
                await Clients.Caller.SendAsync("onError", "Error on sending message");
            }
        }

        public async Task<IEnumerable<Room>> GetActiveRooms()
        {
            return await _repositoryWrapper.Room.GetAllRoomsAsync();
        }

        public async Task<IEnumerable<Message>> GetMessagesFromRoom(string roomName)
        {
            return await _repositoryWrapper.Message.GetAllMessagesFromRoomAsync(roomName);
        }

        public async Task<IEnumerable<Room>> GetUserRooms(string userName)
        {
            try
            {
                var user = _repositoryWrapper.User.FindByCondition(u => u.UserName == userName).FirstOrDefault();
                return await Task.FromResult(_repositoryWrapper.Room.FindByCondition(r => r.OwnerId == user.Id).ToList());
            }
            catch (Exception)
            {
                await Clients.Caller.SendAsync("onError", "No user rooms");
            }

            return await Task.FromResult(new List<Room>());
        }

        public async Task<IEnumerable<User>> GetAllUsersInRoom(string roomName)
        {
            return await Task.FromResult(_repositoryWrapper.User.FindByCondition(u => u.Room == roomName).ToList());
        }

        public async Task<IEnumerable<string>> GetCategories()
        {
            return await Task.FromResult(ItemCategory.categories);
        }
        public async Task<Tuple<Item, Bid>> GetItemFromRoom(string roomName)
        {
            var room = _repositoryWrapper.Room.FindByCondition(r => r.Name == roomName).FirstOrDefault();
            var bidItem = _repositoryWrapper.Item.FindByCondition(i => i.Id == room.ItemId).FirstOrDefault();
            var amount = _repositoryWrapper.Bid.FindByCondition(i => i.ItemId == bidItem.Id).FirstOrDefault();

            return await Task.FromResult(new Tuple<Item, Bid>(bidItem, amount));
        }

        public async Task<Room> GetRoomDetails(string roomName)
        {
            return await Task.FromResult(_repositoryWrapper.Room.FindByCondition(r => r.Name == roomName).FirstOrDefault());
        }
    }
}

