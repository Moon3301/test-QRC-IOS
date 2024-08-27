

namespace Domain
{
	public class Pagination
    {
        public string Entity { get; set; } = string.Empty;
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 10;
		public int PageCount { get; set; } = 0;
		public int RecordCount { get; set; } = 0;
		public string SortColumn { get; set; } = string.Empty;
		public string SortOrder { get; set; } = "ASC";
    }

}
