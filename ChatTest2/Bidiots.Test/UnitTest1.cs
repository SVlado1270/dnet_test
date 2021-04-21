using System.Threading.Tasks;
using Xunit;
using Bidiots.Entities;
using System.Net.Http;
using Newtonsoft.Json;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.Hosting;
using System.Text;
using System.Diagnostics;

namespace Bidiots.Test
{
    public class UnitTest1
    {
        private readonly TestServer testServer;
        private readonly HttpClient _client;


        public UnitTest1()
        {
            testServer = new TestServer(new WebHostBuilder()
           .UseStartup<Startup>().UseSetting("ConnectionStrings:DefaultConnection", "Data Source = auctionapp.db"));
            _client = testServer.CreateClient();

            
        }

        /*public static MockJwtTokens()
        {
            var SecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ByYM000OLlMQG6VVVp1OH7Xzyr7gHuw1qvUC5dcGt3SNM")) { KeyId = Guid.NewGuid().ToString() };
            var SigningCredentials = new SigningCredentials(SecurityKey, SecurityAlgorithms.HmacSha256);
        }*/

        [Fact]
        public async Task Check_InvalidCredentials()
        {
            string apiUrl = "http://localhost:63920/api/v1/users/Login";
            UserModel user = new UserModel() { UserName = "Vlado User Inexistent", Password = "dmxhZA==" };
            var userJson = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");

            Trace.WriteLine(userJson);

            var response = await _client.PostAsync(apiUrl, userJson);

            var statusCode = response.StatusCode;

            Assert.Equal(System.Net.HttpStatusCode.Unauthorized, statusCode);
        }
    }
}
