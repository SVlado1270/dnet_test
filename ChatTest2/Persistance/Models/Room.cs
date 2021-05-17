using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Persistence.Models
{
    [ExcludeFromCodeCoverage]
    public class Room
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Category { get; set; }
        [Required]
        public Guid OwnerId { get; set; }
        public int ItemId { get; set; }
    }
}
