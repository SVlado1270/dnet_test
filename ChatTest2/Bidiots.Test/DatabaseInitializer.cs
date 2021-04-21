using Bidiots.Models;
using System.Linq;

namespace Bidiots.Test
{
    public class DatabaseInitializer
    {
        public static void Initialize(DataContext context)
        {
            if (context.Users.Any())
            {
                return;
            }

            Seed(context);
        }

        private static void Seed(DataContext context)
        {
            context.SaveChanges();
        }
    }
}