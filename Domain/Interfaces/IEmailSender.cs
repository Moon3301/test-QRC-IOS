
namespace Domain
{
	public interface IEmailSender
	{
		Task SendEmailAsync(string subject, string message);
		Task SendEmailAsync(string email, string subject, string message);
        Task SendEmailAsync(List<string> emails, string subject, string body);
    }
}
