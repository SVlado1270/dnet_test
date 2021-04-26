using Bidiots.Data;
using Microsoft.EntityFrameworkCore;
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
