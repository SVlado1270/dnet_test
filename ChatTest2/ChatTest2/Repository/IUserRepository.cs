using Bidiots.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace Bidiots.Repository
{
    public interface IUserRepository : IRepositoryBase<User>
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(Guid guid);
        Task<User> GetUserWithDetailsAsync(Guid guid);
        Task<User> GetUserByNameAsync(string name);
        void CreateUser(User user);
        void UpdateUser(User user);
        void DeleteUser(User user);
    }
}
