using AutoMapper;
using Bidiots.Entities;
using Bidiots.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Persistence.Interfaces;
using Persistence.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace Bidiots.Controllers
{
    [Route("api/v1/users")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IRepositoryWrapper _repository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public UserController(IRepositoryWrapper repository, IMapper mapper, IConfiguration configuration)
        {
            _repository = repository;
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("Register", Name = "CreateAccount")]
        public async Task<IActionResult> CreateUser([FromBody] UserModel user)
        {

            if (user == null || user.UserName == null || user.Password == null || user.FullName == null)
            {
                return BadRequest("Empty User");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model object");
            }
            if (_repository.User.FindByCondition(u => u.UserName == user.UserName).FirstOrDefault() == null)
            {
                Tuple<byte[], byte[]> saltedPassword = Persistence.Models.User.SaltifyPassword(user.Password);
                User _user = new User { Id = Guid.NewGuid(), FullName = user.FullName, UserName = user.UserName, Salt = saltedPassword.Item1, PasswordSalted = saltedPassword.Item2 };
                _repository.User.CreateUser(_user);
                await _repository.SaveAsync();

                return CreatedAtRoute("CreateAccount", new { id = _user.Id }, _user.Id);
            }
            else
            {
                return Conflict();
            }
        }

        [HttpPost]
        [Route("Login", Name = "Login")]
        public async Task<ActionResult> CheckCredentialsAsync([FromBody] UserModel user)
        {

            if (user == null || user.UserName == null || user.Password == null)
            {
                return BadRequest("Empty User");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model object");
            }

            var _user = await _repository.User.GetUserByNameAsync(user.UserName);


            if (_user == null)
            {
                return Unauthorized("User not found");

            }

            using (var deriveBytes = new Rfc2898DeriveBytes(user.Password, _user.Salt))
            {
                byte[] newKey = deriveBytes.GetBytes(32);

                if (!newKey.SequenceEqual(_user.PasswordSalted))
                    return Unauthorized("Invalid credentials!");
            }

            var SecurityToken = new TokenIssuer(_configuration).SecurityToken(_user);

            return Ok((new
            {
                token = new JwtSecurityTokenHandler().WriteToken(SecurityToken),
                userid = _user.Id.ToString(),
                username = _user.UserName,
                expiration = SecurityToken.ValidTo
            }));
        }
    }
}
