using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;

namespace Bidiots.Models
{
    [Table("Users")]
    public class User
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Username is required")]
        [StringLength(32, ErrorMessage = "Username can't be longer than 32 characters")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(60, ErrorMessage = "Name can't be longer than 32 characters")]
        public string FullName { get; set; }
        [Required]
        [MaxLength(32)]
        public byte[] PasswordSalted { get; set; }
        [Required]
        [MaxLength(32)]
        public byte[] Salt { get; set; }
        public string Room { get; set; }
        public virtual ICollection<Message> Messages { get; set; }
        public virtual ICollection<Item> Items { get; set; }

        public static Tuple<byte[], byte[]> SaltifyPassword(string password)
        {
            byte[] salt, key;
            using (var deriveBytes = new Rfc2898DeriveBytes(password, 32))
            {
                salt = deriveBytes.Salt;
                key = deriveBytes.GetBytes(32);
            }
            return new Tuple<byte[], byte[]>(salt, key);
        }
    }
}
