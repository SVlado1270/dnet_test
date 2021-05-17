using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Persistence.Models
{
    [ExcludeFromCodeCoverage]
    public class Item
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Name is required")]
        [StringLength(32, ErrorMessage = "Name can't be longer than 32 characters")]
        public string Name { get; set; }
        [Required]
        public string URL { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public Guid OwnerId { get; set; }
        [Required(ErrorMessage = "Tags are required")]
        [StringLength(32, ErrorMessage = "Tags can't be longer than 32 characters")]
        public string Category { get; set; }
    }
}
