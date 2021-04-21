using Bidiots.Hubs;
using Bidiots.Models;
using Microsoft.EntityFrameworkCore;
using SignalR_UnitTestingSupportCommon.Hubs;
using System;
using System.Diagnostics;
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
            Assert.True(DbInMemorySqlite.Users.Count() == 0);
            DbInMemorySqlite.Users.Add(new User()
            {
                Id = Guid.NewGuid(),
                UserName = "Vasea",
                FullName = "Vasea",
                PasswordSalted = new byte[] { 0x20 },
                Salt = new byte[] { 0x20 },
            });
            DbInMemorySqlite.SaveChangesAsync();
            Assert.True(DbInMemorySqlite.Users.Count() == 1);
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_When_ValidUserName_Then_CreateRoomShouldCreateARoom()
        {
            Assert.True(DbInMemorySqlite.Rooms.Count() == 0);
            DbInMemorySqlite.Users.Add(new User()
            {
                Id = Guid.NewGuid(),
                UserName = "Vasea",
                FullName = "Vasea",
                PasswordSalted = new byte[] { 0x20 },
                Salt = new byte[] { 0x20 },
            });
            await DbInMemorySqlite.SaveChangesAsync();
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom("RoomieGroomie", "Vasea");
            await DbInMemorySqlite.SaveChangesAsync();
            var roomFromDb = DbInMemorySqlite.Rooms.FirstOrDefault();
            Assert.NotNull(roomFromDb);
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_When_InvalidUserName_Then_CreateRoomShouldNotCreateARoom()
        {
            Assert.True(DbInMemorySqlite.Rooms.Count() == 0);
            DbInMemorySqlite.Users.Add(new User()
            {
                Id = Guid.NewGuid(),
                UserName = "Vasea",
                FullName = "Vasea",
                PasswordSalted = new byte[] { 0x20 },
                Salt = new byte[] { 0x20 },
            });
            await DbInMemorySqlite.SaveChangesAsync();
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom("RoomieGroomie", "VaseaClarNuInBazaDeDate");
            await DbInMemorySqlite.SaveChangesAsync();
            var roomFromDb = DbInMemorySqlite.Rooms.FirstOrDefault();
            Assert.Null(roomFromDb);
        }
    }
}
