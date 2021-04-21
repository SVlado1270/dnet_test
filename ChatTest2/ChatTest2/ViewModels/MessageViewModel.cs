using System.Diagnostics.CodeAnalysis;

namespace Bidiots.ViewModels
{
    [ExcludeFromCodeCoverage]
    public class MessageViewModel
    {
        public string From { get; set; }
        public string To { get; set; }
        public string Content { get; set; }
    }
}
