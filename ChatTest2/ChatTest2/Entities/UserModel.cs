using System.ComponentModel.DataAnnotations;

namespace Bidiots.Entities
{
    public class UserModel
    {
        [Required]
        public string UserName { get; set; }
        public string FullName { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
