using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace OGDCLInternPortal.API.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendInternWelcomeEmailAsync(string internEmail, string internName, string temporaryPassword)
    {
        var subject = "Welcome to OGDCL Internship Program - Your Account Credentials";
        var body = $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;'>
                <div style='background-color: #004B87; padding: 15px; text-align: center; border-radius: 6px 6px 0 0;'>
                    <h2 style='color: white; margin: 0;'>Oil & Gas Development Company Limited</h2>
                    <p style='color: #E2E8F0; margin: 5px 0 0 0;'>Internship Management Portal</p>
                </div>
                <div style='padding: 20px;'>
                    <h3>Dear {internName},</h3>
                    <p>Welcome to the OGDCL Internship Program! Your supervisor has created an account for you on the intern portal.</p>
                    <p>Below are your initial login credentials:</p>
                    <div style='background-color: #F7FAFC; border-left: 4px solid #004B87; padding: 15px; margin: 15px 0;'>
                        <p style='margin: 5px 0;'><strong>Portal URL:</strong> <a href='http://localhost:3000/intern'>OGDCL Intern Portal</a></p>
                        <p style='margin: 5px 0;'><strong>Email:</strong> {internEmail}</p>
                        <p style='margin: 5px 0;'><strong>Temporary Password:</strong> <code style='font-size: 16px; background-color: #EDF2F7; padding: 2px 6px; border-radius: 4px;'>{temporaryPassword}</code></p>
                    </div>
                    <p>Please log in and change your password upon your first access.</p>
                    <br/>
                    <p>Best regards,<br/><strong>OGDCL HR & Internship Management Team</strong></p>
                </div>
            </div>";

        await SendEmailAsync(internEmail, subject, body);
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
        try
        {
            var host = _config["EmailSettings:Host"] ?? "smtp.gmail.com";
            var port = int.Parse(_config["EmailSettings:Port"] ?? "465");
            var useSsl = bool.Parse(_config["EmailSettings:UseSsl"] ?? "true");
            var senderEmail = _config["EmailSettings:SenderEmail"] ?? "immadonline702@gmail.com";
            var password = _config["EmailSettings:Password"] ?? "";
            var senderName = _config["EmailSettings:SenderName"] ?? "OGDCL";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(senderName, senderEmail));
            message.To.Add(new MailboxAddress(toEmail, toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = htmlBody
            };
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            // Port 465 uses SSL directly (SecureSocketOptions.SslOnConnect)
            await client.ConnectAsync(host, port, useSsl ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(senderEmail, password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("Successfully sent email to {ToEmail}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {ToEmail}", toEmail);
            // Non-blocking for intern creation if SMTP fails, but log error
        }
    }
}
