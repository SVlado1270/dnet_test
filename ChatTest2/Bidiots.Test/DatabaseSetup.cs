using Bidiots.Data;
using Microsoft.EntityFrameworkCore;
using Persistence.Models;
using System;
using System.Diagnostics.CodeAnalysis;

namespace Bidiots.Test
{
    [ExcludeFromCodeCoverage]
    class DatabaseSetup : IDisposable
    {
        protected readonly DataContext _dataContenxt;

        public DatabaseSetup()
        {
            var options = new DbContextOptionsBuilder<DataContext>().UseInMemoryDatabase("Test").Options;
            _dataContenxt = new DataContext(options);
            _dataContenxt.Database.EnsureCreated();

            DatabaseInitializer.Initialize(_dataContenxt);
        }
        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                _dataContenxt.Database.EnsureDeleted();
                _dataContenxt.Dispose();
            }
        }

        public static void AddUser(DataContext dataContext)
        {
            dataContext.Users.Add(new User()
            {
                Id = new("E1ADB661-D300-4E90-8664-981905B5369B"),
                UserName = "Vasea",
                FullName = "Vasea",
                PasswordSalted = new byte[] { 0x20 },
                Salt = new byte[] { 0x20 },
            });
            dataContext.SaveChangesAsync();
            dataContext.ChangeTracker.Clear();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        ~DatabaseSetup()
        {
            Dispose();
        }

    }
}
