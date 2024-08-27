using Domain;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client.Platforms.Features.DesktopOs.Kerberos;
using System.Net;
using System.Net.Mail;

namespace Infrastructure.Services
{
	public class EmailSettings
	{
		public string Host { get; set; } = string.Empty;
		public int Port { get; set; } = 0;
		public bool EnableSSL { get; set; }
		public string FromEmail { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
		public string FromName { get; set; } = string.Empty;
	}
	public class EmailSender(IOptions<EmailSettings> emailSettings) : IEmailSender
	{
		private readonly EmailSettings _emailSettings = emailSettings.Value;

        public async Task SendEmailAsync(List<string> emails, string subject, string body)
        {
           
            var credentials = new NetworkCredential(_emailSettings.FromEmail, _emailSettings.Password);

            var client = new SmtpClient()
            {
                Port = _emailSettings.Port,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Host = _emailSettings.Host,
                EnableSsl = _emailSettings.EnableSSL,
                Credentials = credentials
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_emailSettings.FromEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            foreach (var email in emails)
            {
                mailMessage.Bcc.Add(email);
            }

            // Optionally, add a visible recipient (To) or CC if needed
            // mailMessage.To.Add(visibleRecipientAddress);
            // mailMessage.CC.Add(ccRecipientAddress);

            try
            {
                await client.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                // Log or handle exceptions
               throw new SolutionException(ex.Message, ex);
            }
        }



        public async Task SendEmailAsync(string email, string subject, string message)
		{
			try
			{
				// Credentials
				var credentials = new NetworkCredential(_emailSettings.FromEmail, _emailSettings.Password);

				// Mail message
				var mail = new MailMessage()
				{
					From = new MailAddress(_emailSettings.FromEmail, _emailSettings.FromName),
					Subject = subject,
					Body = message,
					IsBodyHtml = true
				};

				mail.To.Add(new MailAddress(email));

				// Smtp client
				var client = new SmtpClient()
				{
					Port = _emailSettings.Port,
					DeliveryMethod = SmtpDeliveryMethod.Network,
					UseDefaultCredentials = false,
					Host = _emailSettings.Host,
					EnableSsl = _emailSettings.EnableSSL,
					Credentials = credentials
				};

				// Send it...         
				await client.SendMailAsync(mail);
			}
			catch (Exception ex)
			{
				// TODO: handle exception
				throw new SolutionException(ex.Message);
			}

			await Task.CompletedTask;
		}

		public async Task SendEmailAsync(string subject, string message)
		{
			await SendEmailAsync(_emailSettings.FromEmail, subject, message);
		}


	}

}
