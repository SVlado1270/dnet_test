using System.ComponentModel.DataAnnotations;

namespace Bidiots.Entities
{
    public class ItemModel
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string URL { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string Category { get; set; }
    }
}
