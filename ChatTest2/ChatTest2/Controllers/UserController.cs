using AutoMapper;
using Bidiots.Entities;
using Bidiots.Models;
using Bidiots.Repository;
using Bidiots.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
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
        [Route("AddUser", Name = "CreateAccount")]
        public async Task<IActionResult> CreateUser([FromBody] UserModel user)
        {

            if (user == null)
            {
                return BadRequest("Empty User");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model object");
            }

            Tuple<byte[], byte[]> saltedPassword = Models.User.SaltifyPassword(user.Password);
            User _user = new User { Id = Guid.NewGuid(), FullName = user.FullName, UserName = user.UserName, Salt = saltedPassword.Item1, PasswordSalted = saltedPassword.Item2 };
            _repository.User.CreateUser(_user);
            await _repository.SaveAsync();

            return CreatedAtRoute("CreateAccount", new { id = _user.Id }, _user.Id);
        }
        
        [HttpPost]
        [Route("Login", Name = "Login")]
        public async Task<ActionResult> CheckCredentialsAsync([FromBody] UserModel user)
        {

            if (user == null)
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
                byte[] newKey = deriveBytes.GetBytes(32);  // derive a 20-byte key

                if (!newKey.SequenceEqual(_user.PasswordSalted))
                    return Unauthorized("Invalid credentials!");
            }

            var SecurityToken = new TokenIssuer(_configuration).SecurityToken(_user);

            return Ok((new
            {
                token = new JwtSecurityTokenHandler().WriteToken(SecurityToken),
                userid = _user.Id.ToString(),
                expiration = SecurityToken.ValidTo
            }));
        }


    }
}
