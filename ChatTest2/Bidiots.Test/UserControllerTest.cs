using System.Threading.Tasks;
using Xunit;
using Bidiots.Entities;
using System.Net.Http;
using Newtonsoft.Json;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.Hosting;
using System.Text;
using System.Diagnostics;
using System;
using Microsoft.Extensions.Configuration;

namespace Bidiots.Test
{
    public class TestsFixture : IDisposable
    {
        public readonly TestServer testServer;
        public readonly HttpClient client;
        protected readonly long timestamp = DateTime.Now.ToFileTime();
        public TestsFixture()
        {
            testServer = new TestServer(new WebHostBuilder()
                .UseStartup<Startup>()
                .UseSetting("ConnectionStrings:DefaultConnection", $"Data Source = auctionapp-{timestamp}.db")
                .UseContentRoot(Environment.CurrentDirectory)
                .UseConfiguration(new ConfigurationBuilder()
                .SetBasePath(Environment.CurrentDirectory)
                .AddJsonFile("appsettings.json")
                .Build()));
            client = testServer.CreateClient();
        }

        public void Dispose()
        {
            testServer.Dispose();
            client.Dispose();
        }
    }

    public class UserControllerTest : IClassFixture<TestsFixture>
    {
        private readonly HttpClient client;
        public UserControllerTest(TestsFixture testsFixture)
        {
            client = testsFixture.client;
        }

        [Fact]
        public async Task Given_User_When_InvalidCredeantials_Then_LoginShouldReturnInvalidCredentials()
        {
            string apiUrl = "http://localhost:63920/api/v1/users/Login";
            UserModel user = new UserModel() { UserName = "Vlado User Inexistent", Password = "dmxhZA==" };
            var userJson = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");

            Trace.WriteLine(userJson);

            var response = await client.PostAsync(apiUrl, userJson);

            var statusCode = response.StatusCode;

            Assert.Equal(System.Net.HttpStatusCode.Unauthorized, statusCode);
        }

        [Fact]
        public async Task Given_UserModel_When_NewUser_Then_RegisterShouldReturnCreatedStatusCode()
        {
            string apiUrl = "http://localhost:63920/api/v1/users/Register";
            UserModel user = new UserModel() { UserName = "Vladohtrg2", Password = "dmxhZA==", FullName = "Vlado" };
            var userJson = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");

            Trace.WriteLine(userJson);

            var response = await client.PostAsync(apiUrl, userJson);

            var statusCode = response.StatusCode;

            Assert.Equal(System.Net.HttpStatusCode.Created, statusCode);
        }

        [Fact]
        public async Task Given_UserModel_When_NullUser_Then_RegisterShouldReturnBadRequest()
        {
            string apiUrl = "http://localhost:63920/api/v1/users/Register";
            UserModel user = new();
            var userJson = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");

            Trace.WriteLine(userJson);

            var response = await client.PostAsync(apiUrl, userJson);

            var statusCode = response.StatusCode;

            Assert.Equal(System.Net.HttpStatusCode.BadRequest, statusCode);
        }

        [Fact]
        public async Task Given_User_When_ValidCredentials_Then_LoginShouldReturnOK()
        {
            string apiUrl = "http://localhost:63920/api/v1/users/Login";
            UserModel user = new UserModel() { UserName = "Vladohtrg2", Password = "dmxhZA==" };
            var userJson = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");

            Trace.WriteLine(userJson);

            var response = await client.PostAsync(apiUrl, userJson);

            var statusCode = response.StatusCode;

            Assert.Equal(System.Net.HttpStatusCode.OK, statusCode);
        }
    }
}
