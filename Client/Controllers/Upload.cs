﻿using Domain.Interfaces;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;
using System.Text;

namespace Client.Controllers
{
	[Route("[controller]")]
	public class Upload : Controller
	{
		[HttpPost("Multipart")]
		public async Task<IActionResult> Multipart()
		{
			var file = string.Concat(DateTime.UtcNow.ToString("yyyyMMdd"), "_", Path.GetRandomFileName(), ".jpg");
			var path = Path.Combine(Directory.GetCurrentDirectory(), @$"wwwroot\uploads", file);
			using var stream = System.IO.File.Create(path);
			await Request.Stream(stream);
			return new JsonResult(file); //[(file.LastIndexOf(@"\") + 1)..]
		}

		[HttpPost("Delete")]
		public void Delete(string file)
		{
			if (!string.IsNullOrEmpty(file))
			{
					FileInfo item = new(Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\uploads", file));
					if (item.Exists) item.Delete();
			}
		}
	}

	public static class MultipartRequestHelper
	{
		// Content-Type: multipart/form-data; boundary="----WebKitFormBoundarymx2fSWqWSd0OxQqq"
		// The spec says 70 characters is a reasonable limit.
		public static string GetBoundary(MediaTypeHeaderValue contentType, int lengthLimit)
		{
			//var boundary = Microsoft.Net.Http.Headers.HeaderUtilities.RemoveQuotes(contentType.Boundary);// .NET Core <2.0
			var boundary = HeaderUtilities.RemoveQuotes(contentType.Boundary).Value; //.NET Core 2.0
			if (string.IsNullOrWhiteSpace(boundary))
			{
				throw new InvalidDataException("Missing content-type boundary.");
			}

			if (boundary.Length > lengthLimit)
			{
				throw new InvalidDataException(
					$"Multipart boundary length limit {lengthLimit} exceeded.");
			}

			return boundary;
		}

		public static bool IsMultipartContentType(string contentType)
		{
			return !string.IsNullOrEmpty(contentType)
					&& contentType.Contains("multipart/", StringComparison.OrdinalIgnoreCase);
		}

		public static bool HasFormDataContentDisposition(ContentDispositionHeaderValue contentDisposition)
		{
			// Content-Disposition: form-data; name="key";
			return contentDisposition != null
					&& contentDisposition.DispositionType.Equals("form-data")
					&& string.IsNullOrEmpty(contentDisposition.FileName.Value) // For .NET Core <2.0 remove ".Value"
					&& string.IsNullOrEmpty(contentDisposition.FileNameStar.Value); // For .NET Core <2.0 remove ".Value"
		}

		public static bool HasFileContentDisposition(ContentDispositionHeaderValue contentDisposition)
		{
			// Content-Disposition: form-data; name="myfile1"; filename="Misc 002.jpg"
			return contentDisposition != null
					&& contentDisposition.DispositionType.Equals("form-data")
					&& (!string.IsNullOrEmpty(contentDisposition.FileName.Value) // For .NET Core <2.0 remove ".Value"
						|| !string.IsNullOrEmpty(contentDisposition.FileNameStar.Value)); // For .NET Core <2.0 remove ".Value"
		}
	}

	public static class StreamingHelper
	{
		private static readonly FormOptions _defaultFormOptions = new();

		public static async Task Stream(this HttpRequest request, Stream targetStream)
		{
			if (!MultipartRequestHelper.IsMultipartContentType(request.ContentType))
			{
				throw new Exception($"Expected a multipart request, but got {request.ContentType}");
			}

			var boundary = MultipartRequestHelper.GetBoundary(
				MediaTypeHeaderValue.Parse(request.ContentType),
				_defaultFormOptions.MultipartBoundaryLengthLimit);
			var reader = new MultipartReader(boundary, request.Body);

			var section = await reader.ReadNextSectionAsync();
			while (section != null)
			{
				var hasContentDispositionHeader = ContentDispositionHeaderValue.TryParse(section.ContentDisposition, out ContentDispositionHeaderValue contentDisposition);

				if (hasContentDispositionHeader)
				{
					if (MultipartRequestHelper.HasFileContentDisposition(contentDisposition))
					{
						await section.Body.CopyToAsync(targetStream);
					}
					else if (MultipartRequestHelper.HasFormDataContentDisposition(contentDisposition))
					{
						// Content-Disposition: form-data; name="key"
						//
						// value

						// Do not limit the key name length here because the 
						// multipart headers length limit is already in effect.

						//var key = HeaderUtilities.RemoveQuotes(contentDisposition.Name);
						var encoding = GetEncoding(section);
						using var streamReader = new StreamReader(
							section.Body,
							encoding,
							detectEncodingFromByteOrderMarks: true,
							bufferSize: 1024,
							leaveOpen: true);
						// The value length limit is enforced by MultipartBodyLengthLimit
						var value = await streamReader.ReadToEndAsync();
						if (String.Equals(value, "undefined", StringComparison.OrdinalIgnoreCase))
						{
							value = String.Empty;
						}
					}
				}

				// Drains any remaining section body that has not been consumed and
				// reads the headers for the next section.
				section = await reader.ReadNextSectionAsync();
			}
		}

		private static Encoding GetEncoding(MultipartSection section)
		{
			var hasMediaTypeHeader = MediaTypeHeaderValue.TryParse(section.ContentType, out MediaTypeHeaderValue mediaType);
			// UTF-7 is insecure and should not be honored. UTF-8 will succeed in
			// most cases.
			if (!hasMediaTypeHeader || Encoding.UTF8.Equals(mediaType.Encoding))
			{
				return Encoding.UTF8;
			}
			return mediaType.Encoding;
		}
	}

}