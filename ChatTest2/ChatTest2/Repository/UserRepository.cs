using Bidiots.Data;
using Microsoft.EntityFrameworkCore;
using Persistence.Interfaces;
using Persistence.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bidiots.Repository
{
    public class UserRepository : RepositoryBase<User>, IUserRepository
    {
        public UserRepository(DataContext dataContext)
    : base(dataContext)
        {
        }
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await FindAll()
               .OrderBy(ow => ow.FullName)
               .ToListAsync();
        }
        public async Task<User> GetUserByIdAsync(Guid guid)
        {
            return await FindByCondition(user => user.Id.Equals(guid))
                .FirstOrDefaultAsync();
        }
        public async Task<User> GetUserByNameAsync(string name)
        {
            return await FindByCondition(user => user.UserName.Equals(name))
                .FirstOrDefaultAsync();
        }
        public async Task<User> GetUserWithDetailsAsync(Guid guid)
        {
            return await FindByCondition(owner => owner.Id.Equals(guid))
                .FirstOrDefaultAsync();
        }
        public void CreateUser(User user)
        {
            Create(user);
        }
        public void UpdateUser(User user)
        {
            Update(user);
        }
        public void DeleteUser(User user)
        {
            Delete(user);
        }
    }
}

