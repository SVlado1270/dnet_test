using System.Diagnostics.CodeAnalysis;

namespace Bidiots.ViewModels
{
    [ExcludeFromCodeCoverage]
    public class UserViewModel
    {
        public string Username { get; set; }
        public string FullName { get; set; }
        public string CurrentRoom { get; set; }
    }
}
