using Bidiots.Models;
using Bidiots.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Bidiots.Repository
{
    public abstract class RepositoryBase<T> : IRepositoryBase<T> where T : class
    {
        protected DataContext _dataContext { get; set; }

        public RepositoryBase(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public IQueryable<T> FindAll()
        {
            return _dataContext.Set<T>().AsNoTracking();
        }

        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression)
        {
            return _dataContext.Set<T>()
                .Where(expression).AsNoTracking();
        }

        public void Create(T entity)
        {
            _dataContext.Set<T>().Add(entity);
        }

        public void Update(T entity)
        {
            _dataContext.Set<T>().Update(entity);
        }

        public void Delete(T entity)
        {
            _dataContext.Set<T>().Remove(entity);
        }
    }
}
