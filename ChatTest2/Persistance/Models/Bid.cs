using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Models
{
    public class Bid
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public int Amount { get; set; }
        public string BidTime { get; set; }
    }
}
