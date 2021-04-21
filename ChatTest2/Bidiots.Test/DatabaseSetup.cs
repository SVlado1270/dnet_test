using Bidiots.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace Bidiots.Test
{

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
        public void Dispose()
        {
            _dataContenxt.Database.EnsureDeleted();
            _dataContenxt.Dispose();
        }
    }
}
