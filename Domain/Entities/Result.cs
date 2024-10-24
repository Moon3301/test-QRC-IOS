using System.ComponentModel;

namespace Domain
{
    public class PaginatedResult<T>
    {
        public IReadOnlyCollection<T> Items { get; set; } = [];
        public Pagination Pages { get; set; } = new();
    }

    public class SelectResult
    {
        public string Id { get; set; } = string.Empty;
        public string Descr { get; set; } = string.Empty; 
    }
}
