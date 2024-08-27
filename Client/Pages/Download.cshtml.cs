using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Client.Pages
{
    public class DownloadModel : PageModel
    {
        private readonly IWebHostEnvironment _hostingEnvironment;

        public DownloadModel(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        public List<string> Directories { get; set; }
        public List<string> Files { get; set; }
        public string CurrentPath { get; set; }

        public void OnGet(string path)
        {
            CurrentPath = path;

            string rootPath = Path.Combine(_hostingEnvironment.WebRootPath, "documents");
            string targetPath = string.IsNullOrEmpty(path) ? rootPath : Path.Combine(rootPath, path);
            if (!Directory.Exists(targetPath))
            {
                Directory.CreateDirectory(targetPath);
            }
            Directories = Directory.GetDirectories(targetPath).Select(d => Path.GetRelativePath(rootPath, d)).ToList();
            Files = Directory.GetFiles(targetPath).Select(f => Path.GetRelativePath(rootPath, f)).ToList();
        }

        public IActionResult OnGetFile(string filePath)
        {
            string rootPath = Path.Combine(_hostingEnvironment.WebRootPath, "documents");
            string fullPath = Path.Combine(rootPath, filePath);

            if (!System.IO.File.Exists(fullPath))
            {
                return NotFound();
            }

            byte[] fileBytes = System.IO.File.ReadAllBytes(fullPath);
            string fileName = Path.GetFileName(fullPath);
            return File(fileBytes, "application/octet-stream", fileName);
        }

    }
}
