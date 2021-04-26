using System.Diagnostics.CodeAnalysis;

namespace Persistence.Models
{
    [ExcludeFromCodeCoverage]
    public class Message
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int ToRoomId { get; set; }
        public User User { get; set; }
        public Room ToRoom { get; set; }
    }
}
