using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;
using Domain.Interfaces;
using Domain;
using Client.Utilities;
using Microsoft.AspNetCore.Authorization;
using HiQPdf;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Client.Controllers
{


	[Authorize]
	[Route("[controller]")]
    public class Document(IServiceUnit service, IRazorViewHtml html, IWebHostEnvironment webHostEnvironment, IEmailSender emailSender, IUserAccount user) : Controller
    {
        private readonly IServiceUnit _service = service;
        private readonly IRazorViewHtml _html = html;
        private readonly IWebHostEnvironment _webHostEnvironment = webHostEnvironment;
        private readonly IEmailSender _emailSender = emailSender;
        private readonly IUserAccount _userHelper = user;

		[HttpGet]
        [Route("Files")]
        public IActionResult Files(string directory)
        {
            string path = Path.Combine(_webHostEnvironment.WebRootPath, "documents", directory);

            var directoryInfo = new DirectoryInfo(path);
            var files = directoryInfo.GetFiles()
                .Select(file => new
                {
                    ParentDirectory = directoryInfo.Name,
                    FileName = file.Name,
                    DateModified = file.CreationTimeUtc
                })
                .OrderByDescending(_ => _.DateModified).ToList();

            // Format this data as needed, e.g., JSON
            return new JsonResult(new { Files = files });
        }


        [HttpPost]
        [Route("Save")]
        public void Save()
        {
            var file = Request.Form.Files[0];
            var fileName = file.FileName;
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "documents", fileName);

            using var fileStream = new FileStream(filePath, FileMode.Create);
            file.CopyTo(fileStream);
        }

        [HttpGet]
        [Route("Download")]
        public IActionResult Download(string file, string type = "pdf")
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "documents", file);

            if (System.IO.File.Exists(path))
            {
                var fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, $"application/{type}", file);
            }

            return NotFound();
        }


        [HttpPost("Batch")]
		public async Task<IActionResult> Batch(MaintenanceFilter filter)
		{
			filter.Status = MaintenanceStatus.Finalizada;

			var root = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "documents");
			var path = DateTime.Now.ToString(@"yyyy-MM").Replace("-", @"\");
            var physical = filter.PhysicalFile;

			if (string.IsNullOrEmpty(physical))
			{
				if (filter.CategoryId == 0)
				{
					physical = "TODOS";
				}
				else
				{
					var category = await _service.Category.ViewById(filter.CategoryId);
					physical = category.Descr.Trim();
				}
			}

			var directory = Path.Combine(root, path, physical);

			var maintenances = await _service.Maintenance.FilterPrint(filter);
			var total = maintenances.Count;

			int filesPerArchive = 100;
			int archiveCounter = 1;
			List<string> currentBatchFiles = new();

			foreach (var id in maintenances)
			{
				await Print(id, directory); // Define this method for PDF creation
				currentBatchFiles.Add(id.ToString());

				if (currentBatchFiles.Count == filesPerArchive || currentBatchFiles.Count == total)
				{
					var rarFileName = (archiveCounter > 1) ? $"{physical}_{archiveCounter}.zip" : $"{physical}.zip";
					string rarFilePath = Path.Combine(root, path, rarFileName);

					if (System.IO.File.Exists(rarFilePath))
					{
						System.IO.File.Delete(rarFilePath);
					}

					ZipFile.CreateFromDirectory(directory, rarFilePath, CompressionLevel.Fastest, false);

					currentBatchFiles.Clear();
					archiveCounter++;

					var files = Directory.GetFiles(directory, "*.pdf");

					// Loop through each file and delete it.
					foreach (string file in files)
					{
						// Delete file.
						System.IO.File.Delete(file);
					}
				}
			}

			// Handle any remaining files in the last batch
			if (currentBatchFiles.Any())
			{
				var rarFileName = (archiveCounter > 1) ? $"{physical}_{archiveCounter}.zip" : $"{physical}.zip";
				string rarFilePath = Path.Combine(root, path, rarFileName);

				if (System.IO.File.Exists(rarFilePath))
				{
					System.IO.File.Delete(rarFilePath);
				}

				ZipFile.CreateFromDirectory(directory, rarFilePath);
			}

			string[] remaining = Directory.GetFiles(directory, "*.pdf");

			// Loop through each file and delete it.
			foreach (string file in remaining)
			{
				// Delete file.
				System.IO.File.Delete(file);
			}

			Directory.Delete(directory);
			return Ok(path);
		}


		[HttpPost("Print")]
        public async Task<IActionResult> Print(int maintenanceId, string directory = "")
        {
            if (directory == "")
            {
                directory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "documents", "pdf");
            }

            var data = await _service.Maintenance.Print(maintenanceId);
            data.BaseUrl = _webHostEnvironment.WebRootPath;

            Directory.CreateDirectory(directory);


            var html = await _html.RenderPartialToStringAsync<PrintView>("Maintenance/Print", data);

            var pdfBytes = ConvertHtmlToPdf(html);
            var file = $"{maintenanceId}.pdf";
            var path = Path.Combine(directory, file);
            using var streamWriter = new StreamWriter(path);
            await streamWriter.BaseStream.WriteAsync(pdfBytes, 0, pdfBytes.Length);

            // Return the PDF file as a download to the client
            return File(pdfBytes, "application/pdf", System.IO.Path.GetFileName(file));
        }

        [HttpPost("Month")]
        public async Task<IActionResult> Month(int month, int year, string directory = "")
        {
            if (directory == "")
            {
                directory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "documents", "pdf");
            }

            var data = await _service.Equipment.MonthPrint(month, year);
            data.BaseUrl = _webHostEnvironment.WebRootPath;

            Directory.CreateDirectory(directory);

            var date = new DateTime(year, month, 1);

            var html = await _html.RenderPartialToStringAsync("Equipment/Month", data);

            var pdfBytes = ConvertHtmlToPdf(html);
            var file = $"{date:yyyy_MM}.pdf";
            var path = Path.Combine(directory, file);
            using var streamWriter = new StreamWriter(path);
            await streamWriter.BaseStream.WriteAsync(pdfBytes, 0, pdfBytes.Length);

            // Return the PDF file as a download to the client
            return File(pdfBytes, "application/pdf", System.IO.Path.GetFileName(file));
        }


        [HttpPost("History")]
        public async Task<IActionResult> History(int id, string directory = "")
        {
            if (directory == "")
            {
                directory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "documents", "pdf");
            }

            var data = await _service.Equipment.EquipmentPrint(id);
            data.BaseUrl = _webHostEnvironment.WebRootPath;

            Directory.CreateDirectory(directory);


            var html = await _html.RenderPartialToStringAsync("Equipment/Print", data);

            var pdfBytes = ConvertHtmlToPdf(html);
            var file = $"{data.Equipment.Serial}.pdf";
            var path = Path.Combine(directory, file);
            using var streamWriter = new StreamWriter(path);
            await streamWriter.BaseStream.WriteAsync(pdfBytes, 0, pdfBytes.Length);

            // Return the PDF file as a download to the client
            return File(pdfBytes, "application/pdf", System.IO.Path.GetFileName(file));
        }



        [HttpPost("Label")]
        public async Task<IActionResult> Label(int equipmentId)
        {
            var data = await _service.Equipment.Label(equipmentId);
            data.BaseUrl = _webHostEnvironment.WebRootPath;

            var directory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "documents", "labels");
            Directory.CreateDirectory(directory);

            var html = await _html.RenderPartialToStringAsync<LabelView>("Equipment/Label", data);
            var pdfBytes = ConvertHtmlToPdf(html);

            var file = $"{equipmentId}.pdf";
            var path = Path.Combine(directory, file);

            using var streamWriter = new StreamWriter(path);
            await streamWriter.BaseStream.WriteAsync(pdfBytes, 0, pdfBytes.Length);

            // Return the PDF file as a download to the client
            return File(pdfBytes, "application/pdf", System.IO.Path.GetFileName(file));
        }





        private byte[] ConvertHtmlToPdf(string html)
        {
			HtmlToPdf converter = new();
            converter.Document.PageSize = PdfPageSize.Letter;
            // Convert the HTML code to memory
            return converter.ConvertHtmlToMemory(html, string.Empty);
        }


        [HttpPost("Printing")]
        public IActionResult Printing()
        {
            return PartialView("Printing");
        }
    }
}


