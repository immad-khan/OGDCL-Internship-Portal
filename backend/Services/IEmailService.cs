namespace OGDCLInternPortal.API.Services;

public interface IEmailService
{
    Task SendInternWelcomeEmailAsync(string internEmail, string internName, string temporaryPassword);
    Task SendEmailAsync(string toEmail, string subject, string htmlBody);
}
