using Bidiots.Data;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace Bidiots.Test
{
    [ExcludeFromCodeCoverage]
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