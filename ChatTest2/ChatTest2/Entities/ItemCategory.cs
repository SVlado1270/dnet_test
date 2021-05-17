using System.Collections.Generic;

namespace Bidiots.Entities
{
    public class ItemCategory
    {
        private static readonly List<string> list = new() { "Cars", "IT&Tech", "Jewellery", "Art", "Clothes", "Furniture" };
        public static List<string> categories = list;
    }
}
