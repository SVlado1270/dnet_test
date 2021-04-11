using System;
using System.Collections.Generic;

namespace Bidiots.Models
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Guid OwnerId { get; set; }
        public virtual ICollection<Item> Items { get; set; }
    }
}
