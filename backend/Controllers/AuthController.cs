using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OGDCLInternPortal.API.Data;
using OGDCLInternPortal.API.DTOs;
using OGDCLInternPortal.API.Models;
using OGDCLInternPortal.API.Services;

namespace OGDCLInternPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IAuthService _authService;

    public AuthController(AppDbContext context, IAuthService authService)
    {
        _context = context;
        _authService = authService;
    }

    [HttpPost("supervisor-login")]
    public async Task<IActionResult> SupervisorLogin([FromBody] LoginRequest request)
    {
        var supervisor = await _context.Supervisors
            .FirstOrDefaultAsync(s => s.Email.ToLower() == request.Email.ToLower());

        if (supervisor == null || !_authService.VerifyPassword(request.Password, supervisor.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        var token = _authService.GenerateJwtTokenForSupervisor(supervisor);

        return Ok(new LoginResponse(
            Token: token,
            Id: supervisor.Id,
            Name: supervisor.Name,
            Email: supervisor.Email,
            Role: "supervisor",
            Department: supervisor.Department,
            Designation: supervisor.Designation
        ));
    }

    [HttpPost("intern-login")]
    public async Task<IActionResult> InternLogin([FromBody] LoginRequest request)
    {
        var intern = await _context.Interns
            .FirstOrDefaultAsync(i => i.Email.ToLower() == request.Email.ToLower());

        if (intern == null || !_authService.VerifyPassword(request.Password, intern.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        var token = _authService.GenerateJwtTokenForIntern(intern);

        return Ok(new LoginResponse(
            Token: token,
            Id: intern.Id,
            Name: intern.Name,
            Email: intern.Email,
            Role: "intern",
            Department: intern.Department,
            Designation: "Intern"
        ));
    }

    [HttpPost("seed-supervisor")]
    public async Task<IActionResult> SeedSupervisor()
    {
        var exists = await _context.Supervisors.AnyAsync();
        if (exists)
        {
            return BadRequest(new { message = "Supervisor already exists in DB." });
        }

        var supervisor = new Supervisor
        {
            Name = "OGDCL Admin Supervisor",
            Email = "immadonline702@gmail.com",
            PasswordHash = _authService.HashPassword("Admin@123"),
            Designation = "Senior Internship Manager",
            Department = "Human Resources",
            Phone = "+92 51 9200000",
            Region = "Islamabad HQ"
        };

        _context.Supervisors.Add(supervisor);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Default supervisor seeded successfully.", email = supervisor.Email, defaultPassword = "Admin@123" });
    }
}
