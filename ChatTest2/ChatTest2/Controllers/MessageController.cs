using AutoMapper;
using Bidiots.Hubs;
using Bidiots.Models;
using Bidiots.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Bidiots.Controllers
{
    [ApiController]
    [Route("api/message")]
    public class MessageController : Controller
    {
        protected readonly IHubContext<MessageHub> _messageHub;
        protected readonly IMapper _mapper;
        protected readonly DataContext _dataContext;

        public MessageController([NotNull] IHubContext<MessageHub> messageHub, IMapper mapper, DataContext dataContext)
        {
            _messageHub = messageHub;
            _mapper = mapper;
            _dataContext = dataContext;
        }

        [HttpPost]
        public async Task<IActionResult> Create(Message messagePost)
         {
            // pentru un user await _messageHub.Clients.User()
            var user = _dataContext.Users.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();

            await _messageHub.Clients.All.SendAsync("sendToReact", "The message " + messagePost.Content + " has been received from: " + messagePost.User.Id);

            return Ok();
        }
        

    }
}
