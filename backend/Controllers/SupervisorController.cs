using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OGDCLInternPortal.API.Data;

namespace OGDCLInternPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SupervisorController : ControllerBase
{
    private readonly AppDbContext _context;

    public SupervisorController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var supervisor = await _context.Supervisors.FirstOrDefaultAsync();
        if (supervisor == null) return NotFound(new { message = "Supervisor profile not found" });

        return Ok(new {
            supervisor.Id,
            supervisor.Name,
            supervisor.Email,
            supervisor.Designation,
            supervisor.Department,
            supervisor.Phone,
            supervisor.Region,
            supervisor.CreatedAt
        });
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] Models.Supervisor update)
    {
        var supervisor = await _context.Supervisors.FirstOrDefaultAsync();
        if (supervisor == null) return NotFound(new { message = "Supervisor not found" });

        supervisor.Name = update.Name;
        supervisor.Designation = update.Designation;
        supervisor.Department = update.Department;
        supervisor.Phone = update.Phone;
        supervisor.Region = update.Region;

        await _context.SaveChangesAsync();
        return Ok(supervisor);
    }
}
