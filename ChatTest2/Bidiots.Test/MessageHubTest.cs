using Bidiots.Data;
using Bidiots.Entities;
using Bidiots.Hubs;
using Microsoft.EntityFrameworkCore;
using SignalR_UnitTestingSupportCommon.Hubs;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Bidiots.Test
{
    public abstract class HubUnitTestsWithEF<DataContext> : HubUnitTestsWithEFSupport<DataContext>, IDisposable
        where DataContext : DbContext
    {
        public HubUnitTestsWithEF()
        {
            SetUp();
        }
        public void Dispose()
        {
            TearDown();
        }
    }
    public class MessageHubTest : HubUnitTestsWithEF<DataContext>
    {
        private MessageHub _messageHub;
        public MessageHubTest() : base()
        {
            _messageHub = null;
        }

        [Fact]
        public void TryGetDbInMemorySqlite_ClearDbInMemorySqliteSuccesfullyTaken()
        {
            Assert.False(DbInMemorySqlite.Users.Any());
            DatabaseSetup.AddUser(DbInMemorySqlite);

            Assert.True(DbInMemorySqlite.Users.Any());
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_When_ValidUserName_Then_CreateRoomShouldCreateARoom()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());
            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom(new RoomModel { RoomName = "RoomieGroomie", UserName = "Vasea", Category = ItemCategory.categories[0] }, new ItemModel { Name = "Flowers", Category = ItemCategory.categories[0], Description = "A flower", URL = "flowerurlhahahehe.com" });
            var roomFromDb = DbInMemorySqlite.Rooms.FirstOrDefault();
            var itemFromDb = DbInMemorySqlite.Items.FirstOrDefault();

            Assert.NotNull(roomFromDb);
            Assert.NotNull(itemFromDb);
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_When_InvalidUserName_Then_CreateRoomShouldNotCreateARoom()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());
            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom(new RoomModel { RoomName = "RoomieGroomie", UserName = "VaseaClarNuInBazaDeDate", Category = ItemCategory.categories[0] }, new ItemModel { Name = "Flowers", Category = ItemCategory.categories[0], Description = "A flower", URL = "flowerurlhahahehe.com" });
            var roomFromDb = DbInMemorySqlite.Rooms.FirstOrDefault();
            var itemFromDb = DbInMemorySqlite.Items.FirstOrDefault();

            Assert.Null(roomFromDb);
            Assert.Null(itemFromDb);
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_When_ValidRoomNameAndUserName_Then_JoinRoomShouldAddUserInRoom()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());
            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom(new RoomModel { RoomName = "RoomieGroomie", UserName = "Vasea", Category = ItemCategory.categories[0] }, new ItemModel { Name = "Flowers", Category = ItemCategory.categories[0], Description = "A flower", URL = "flowerurlhahahehe.com" });
            await _messageHub.JoinRoom("RoomieGroomie", "Vasea");
            var userFromDb = DbInMemorySqlite.Users.FirstOrDefault();

            Assert.Equal("RoomieGroomie", userFromDb.Room);
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_When_InvalidRoomName_Then_JoinRoomShouldNotAddUserInRoom()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());
            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom(new RoomModel { RoomName = "RoomieGroomie", UserName = "Vasea", Category = ItemCategory.categories[0] }, new ItemModel { Name = "Flowers", Category = ItemCategory.categories[0], Description = "A flower", URL = "flowerurlhahahehe.com" });
            await _messageHub.JoinRoom("CameraCareNuExista", "Vasea");
            var userFromDb = DbInMemorySqlite.Users.FirstOrDefault();

            Assert.Null(userFromDb.Room);
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_When_InvalidUserName_Then_JoinRoomShouldNotAddUserInRoom()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());
            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom(new RoomModel { RoomName = "RoomieGroomie", UserName = "Vasea", Category = ItemCategory.categories[0] }, new ItemModel { Name = "Flowers", Category = ItemCategory.categories[0], Description = "A flower", URL = "flowerurlhahahehe.com" });
            await _messageHub.JoinRoom("RoomieGroomie", "Vlado");
            var userFromDb = DbInMemorySqlite.Users.FirstOrDefault();

            Assert.Null(userFromDb.Room);
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_When_RoomNameAlreadyExists_Then_CreateRoomShouldNotCreateARoom()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());
            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom(new RoomModel { RoomName = "RoomieGroomie", UserName = "Vasea", Category = ItemCategory.categories[0] }, new ItemModel { Name = "Flowers", Category = ItemCategory.categories[0], Description = "A flower", URL = "flowerurlhahahehe.com" });
            await DbInMemorySqlite.SaveChangesAsync();
            await _messageHub.CreateRoom(new RoomModel { RoomName = "RoomieGroomie", UserName = "Vasea", Category = ItemCategory.categories[0] }, new ItemModel { Name = "Flowers", Category = ItemCategory.categories[0], Description = "A flower", URL = "flowerurlhahahehe.com" });
            await DbInMemorySqlite.SaveChangesAsync();

            Assert.True(DbInMemorySqlite.Rooms.Count() == 1);
        }

        [Fact]
        public async Task Given_CallGetActiveRooms_Then_GetActiveRoomsShouldReturnAllRooms()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());
            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom(new RoomModel { RoomName = "RoomieGroomie", UserName = "Vasea", Category = ItemCategory.categories[0] }, new ItemModel { Name = "Flowers", Category = ItemCategory.categories[0], Description = "A flower", URL = "flowerurlhahahehe.com" });
            var roomFromDb = _messageHub.GetActiveRooms();

            Assert.NotNull(roomFromDb);
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_ValidArguments_Then_DeleteRoomShouldDeleteRoom()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());
            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom(new RoomModel { RoomName = "RoomieGroomie", UserName = "Vasea", Category = ItemCategory.categories[0] }, new ItemModel { Name = "Flowers", Category = ItemCategory.categories[0], Description = "A flower", URL = "flowerurlhahahehe.com" });
            DbInMemorySqlite.ChangeTracker.Clear();
            await _messageHub.DeleteRoom("RoomieGroomie", "Vasea");

            Assert.False(DbInMemorySqlite.Rooms.Any());
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_When_InvalidLengthRoomName_Then_CreateRoomShouldNotCreateARoom()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());
            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom(new RoomModel { RoomName = "Rooo", UserName = "Vasea", Category = ItemCategory.categories[0] }, new ItemModel { Name = "Flowers", Category = ItemCategory.categories[0], Description = "A flower", URL = "flowerurlhahahehe.com" });

            Assert.False(DbInMemorySqlite.Rooms.Any());
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_When_InvalidRoomName_Then_CreateRoomShouldNotCreateARoom()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());
            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom(new RoomModel { RoomName = "$$$$$$$$$$", UserName = "Vasea", Category = ItemCategory.categories[0] }, new ItemModel { Name = "Flowers", Category = ItemCategory.categories[0], Description = "A flower", URL = "flowerurlhahahehe.com" });
            await DbInMemorySqlite.SaveChangesAsync();

            Assert.False(DbInMemorySqlite.Rooms.Any());
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_When_ValidRoomNameAndUserName_And_UserInRoom_Then_LeaveRoom()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());
            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom(new RoomModel { RoomName = "RoomieGroomie", UserName = "Vasea", Category = ItemCategory.categories[0] }, new ItemModel { Name = "Flowers", Category = ItemCategory.categories[0], Description = "A flower", URL = "flowerurlhahahehe.com" });
            await _messageHub.JoinRoom("RoomieGroomie", "Vasea");
            var userFromDb = DbInMemorySqlite.Users.FirstOrDefault();
            Assert.Equal("RoomieGroomie", userFromDb.Room);
            DbInMemorySqlite.ChangeTracker.Clear();
            await _messageHub.LeaveRoom("RoomieGroomie", "Vasea");
            userFromDb = DbInMemorySqlite.Users.FirstOrDefault();

            Assert.Null(userFromDb.Room);
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_When_InvalidRoomName_And_UserInRoom_Then_LeaveRoomShouldNotLeaveRoom()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());
            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom(new RoomModel { RoomName = "RoomieGroomie", UserName = "Vasea", Category = ItemCategory.categories[0] }, new ItemModel { Name = "Flowers", Category = ItemCategory.categories[0], Description = "A flower", URL = "flowerurlhahahehe.com" });
            await _messageHub.JoinRoom("RoomieGroomie", "Vasea");
            var userFromDb = DbInMemorySqlite.Users.FirstOrDefault();
            Assert.Equal("RoomieGroomie", userFromDb.Room);
            DbInMemorySqlite.ChangeTracker.Clear();
            await _messageHub.LeaveRoom("CameraCareNuExista", "Vasea");
            userFromDb = DbInMemorySqlite.Users.FirstOrDefault();

            Assert.Equal("RoomieGroomie", userFromDb.Room);
        }

        [Fact]
        public async Task Given_UserName_When_ValidUserName_And_UserHasRooms_Then_GetUserRoomsShouldReturnUserRooms()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());
            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom(new RoomModel { RoomName = "RoomieGroomie", UserName = "Vasea", Category = ItemCategory.categories[0] }, new ItemModel { Name = "Flowers", Category = ItemCategory.categories[0], Description = "A flower", URL = "flowerurlhahahehe.com" });
            var roomFromDb = _messageHub.GetUserRooms("Vasea");
            Assert.NotNull(roomFromDb);
        }
    }
}
