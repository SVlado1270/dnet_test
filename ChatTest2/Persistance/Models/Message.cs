using System;
using System.Diagnostics.CodeAnalysis;

namespace Persistence.Models
{
    [ExcludeFromCodeCoverage]
    public class Message
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string RoomName { get; set; }
        public Guid UserId { get; set; }
    }
}
