using System.ComponentModel.DataAnnotations;

namespace Bidiots.Entities
{
    public class RoomModel
    {
        [Required]
        public string RoomName { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Category { get; set; }
    }
}
