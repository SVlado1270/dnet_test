using Bidiots.Entities;
using Bidiots.Models;
using Microsoft.IdentityModel.Tokens;
using System;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Text;

namespace Bidiots.Security
{
    public class TokenIssuer
    {

        private readonly IConfiguration _configuration;

        public TokenIssuer(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public JwtSecurityToken SecurityToken(User user)
        {

            var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, user.Id.ToString()),
                };

            authClaims.Add(new Claim(ClaimTypes.Role, UserRoles.User));

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(3),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                    );

            return token;
        }
    }
}
