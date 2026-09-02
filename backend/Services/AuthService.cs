using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using OGDCLInternPortal.API.Models;

namespace OGDCLInternPortal.API.Services;

public interface IAuthService
{
    string GenerateJwtTokenForSupervisor(Supervisor supervisor);
    string GenerateJwtTokenForIntern(Intern intern);
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}

public class AuthService : IAuthService
{
    private readonly IConfiguration _config;

    public AuthService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateJwtTokenForSupervisor(Supervisor supervisor)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, supervisor.Id.ToString()),
            new Claim(ClaimTypes.Email, supervisor.Email),
            new Claim(ClaimTypes.Name, supervisor.Name),
            new Claim(ClaimTypes.Role, "supervisor")
        };

        return GenerateToken(claims);
    }

    public string GenerateJwtTokenForIntern(Intern intern)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, intern.Id.ToString()),
            new Claim(ClaimTypes.Email, intern.Email),
            new Claim(ClaimTypes.Name, intern.Name),
            new Claim(ClaimTypes.Role, "intern")
        };

        return GenerateToken(claims);
    }

    private string GenerateToken(IEnumerable<Claim> claims)
    {
        var secret = _config["Jwt:Secret"] ?? "OGDCL_SUPER_SECRET_JWT_KEY_2024_MUST_BE_AT_LEAST_32_BYTES_LONG!";
        var issuer = _config["Jwt:Issuer"] ?? "OGDCLInternPortalAPI";
        var audience = _config["Jwt:Audience"] ?? "OGDCLInternPortalClient";
        var expiryDays = int.Parse(_config["Jwt:ExpiryDays"] ?? "7");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(expiryDays),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        if (string.IsNullOrEmpty(passwordHash)) return false;
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }
}
