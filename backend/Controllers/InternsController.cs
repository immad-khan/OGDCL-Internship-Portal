using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OGDCLInternPortal.API.Data;
using OGDCLInternPortal.API.DTOs;
using OGDCLInternPortal.API.Models;
using OGDCLInternPortal.API.Services;

namespace OGDCLInternPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InternsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IAuthService _authService;
    private readonly IEmailService _emailService;

    public InternsController(AppDbContext context, IAuthService authService, IEmailService emailService)
    {
        _context = context;
        _authService = authService;
        _emailService = emailService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await _context.Interns
            .Include(i => i.Supervisor)
            .OrderByDescending(i => i.CreatedAt)
            .Select(i => new {
                i.Id,
                i.Name,
                i.Email,
                i.Phone,
                i.Department,
                i.University,
                i.Degree,
                i.Cgpa,
                i.StartDate,
                i.EndDate,
                i.Status,
                SupervisorName = i.Supervisor != null ? i.Supervisor.Name : "Supervisor",
                i.CreatedAt
            })
            .ToListAsync();

        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var intern = await _context.Interns
            .Include(i => i.Supervisor)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (intern == null) return NotFound(new { message = "Intern not found" });

        return Ok(new {
            intern.Id,
            intern.Name,
            intern.Email,
            intern.Phone,
            intern.Department,
            intern.University,
            intern.Degree,
            intern.Cgpa,
            intern.StartDate,
            intern.EndDate,
            intern.Status,
            SupervisorName = intern.Supervisor != null ? intern.Supervisor.Name : "Supervisor",
            intern.CreatedAt
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateInternRequest request)
    {
        var existing = await _context.Interns.AnyAsync(i => i.Email.ToLower() == request.Email.ToLower());
        if (existing)
        {
            return BadRequest(new { message = "An intern with this email already exists." });
        }

        // Generate temporary password for intern
        var tempPassword = "Og" + Random.Shared.Next(100000, 999999).ToString() + "!";
        var passwordHash = _authService.HashPassword(tempPassword);

        var supervisor = await _context.Supervisors.FirstOrDefaultAsync();

        var intern = new Intern
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = passwordHash,
            Phone = request.Phone,
            Department = request.Department,
            University = request.University,
            Degree = request.Degree,
            Cgpa = request.Cgpa,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Status = "active",
            SupervisorId = request.SupervisorId ?? supervisor?.Id
        };

        _context.Interns.Add(intern);
        await _context.SaveChangesAsync();

        // Send email via SMTP
        await _emailService.SendInternWelcomeEmailAsync(intern.Email, intern.Name, tempPassword);

        return CreatedAtAction(nameof(GetById), new { id = intern.Id }, new {
            intern.Id,
            intern.Name,
            intern.Email,
            intern.Phone,
            intern.Department,
            intern.University,
            intern.Degree,
            intern.Cgpa,
            intern.StartDate,
            intern.EndDate,
            intern.Status,
            temporaryPassword = tempPassword,
            emailSent = true
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateInternRequest request)
    {
        var intern = await _context.Interns.FindAsync(id);
        if (intern == null) return NotFound(new { message = "Intern not found" });

        intern.Name = request.Name;
        intern.Phone = request.Phone;
        intern.Department = request.Department;
        intern.University = request.University;
        intern.Degree = request.Degree;
        intern.Cgpa = request.Cgpa;
        intern.StartDate = request.StartDate;
        intern.EndDate = request.EndDate;

        await _context.SaveChangesAsync();
        return Ok(intern);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var intern = await _context.Interns.FindAsync(id);
        if (intern == null) return NotFound(new { message = "Intern not found" });

        _context.Interns.Remove(intern);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Intern deleted successfully" });
    }
}
