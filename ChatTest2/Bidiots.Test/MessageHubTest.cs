﻿using Bidiots.Data;
using Bidiots.Hubs;
using Microsoft.EntityFrameworkCore;
using Persistence.Models;
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
            await _messageHub.CreateRoom("RoomieGroomie", "Vasea");
            var roomFromDb = DbInMemorySqlite.Rooms.FirstOrDefault();

            Assert.NotNull(roomFromDb);
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_When_InvalidUserName_Then_CreateRoomShouldNotCreateARoom()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());

            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom("RoomieGroomie", "VaseaClarNuInBazaDeDate");
            var roomFromDb = DbInMemorySqlite.Rooms.FirstOrDefault();

            Assert.Null(roomFromDb);
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_When_ValidRoomNameAndUserName_Then_JoinRoomShouldAddUserInRoom()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());

            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom("RoomieGroomie", "Vasea");
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
            await _messageHub.CreateRoom("RoomieGroomie", "Vasea");
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
            await _messageHub.CreateRoom("RoomieGroomie", "Vasea");
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
            await _messageHub.CreateRoom("Roomie", "Vasea");
            await DbInMemorySqlite.SaveChangesAsync();
            await _messageHub.CreateRoom("Roomie", "Vasea");
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
            await _messageHub.CreateRoom("RoomieGroomie", "Vasea");
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
            await _messageHub.CreateRoom("RoomieGroomie", "Vasea");
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
            await _messageHub.CreateRoom("Room", "Vasea");
            Assert.False(DbInMemorySqlite.Rooms.Any());
        }

        [Fact]
        public async Task Given_RoomNameAndUserName_When_InvalidRoomName_Then_CreateRoomShouldNotCreateARoom()
        {
            Assert.False(DbInMemorySqlite.Rooms.Any());
            DatabaseSetup.AddUser(DbInMemorySqlite);
            _messageHub = new MessageHub(DbInMemorySqlite);
            AssignToHubRequiredProperties(_messageHub);
            await _messageHub.CreateRoom("$$$$$$$$$$", "Vasea");
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
            await _messageHub.CreateRoom("RoomieGroomie", "Vasea");
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
            await _messageHub.CreateRoom("RoomieGroomie", "Vasea");
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
            await _messageHub.CreateRoom("RoomieGroomie", "Vasea");
            var roomFromDb = _messageHub.GetUserRooms("Vasea");
            Assert.NotNull(roomFromDb);
        }

    }
}
