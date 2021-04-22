using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Bidiots.Models
{
    [ExcludeFromCodeCoverage]
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Guid OwnerId { get; set; }
        public virtual ICollection<Item> Items { get; set; }
    }
}
