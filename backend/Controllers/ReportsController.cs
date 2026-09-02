using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OGDCLInternPortal.API.Data;
using OGDCLInternPortal.API.DTOs;
using OGDCLInternPortal.API.Models;

namespace OGDCLInternPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReportsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetReports([FromQuery] int? internId)
    {
        var query = _context.Reports.AsQueryable();

        if (internId.HasValue && internId.Value > 0)
        {
            query = query.Where(r => r.InternId == internId.Value);
        }

        var list = await query
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new {
                r.Id,
                r.InternId,
                r.Title,
                r.Content,
                r.Status,
                r.Rating,
                r.Feedback,
                r.CreatedAt
            })
            .ToListAsync();

        return Ok(list);
    }

    [HttpPost]
    public async Task<IActionResult> SubmitReport([FromBody] ReportCreateDto dto)
    {
        var report = new Report
        {
            InternId = dto.InternId,
            Title = dto.Title,
            Content = dto.Content,
            Status = "submitted"
        };

        _context.Reports.Add(report);
        await _context.SaveChangesAsync();

        return Ok(report);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] ReportStatusUpdateDto dto)
    {
        var report = await _context.Reports.FindAsync(id);
        if (report == null) return NotFound(new { message = "Report not found" });

        report.Status = dto.Status;
        if (!string.IsNullOrEmpty(dto.Feedback))
        {
            report.Feedback = dto.Feedback;
        }

        await _context.SaveChangesAsync();
        return Ok(report);
    }

    [HttpPatch("{id}/rating")]
    public async Task<IActionResult> RateReport(int id, [FromBody] ReportRatingDto dto)
    {
        var report = await _context.Reports.FindAsync(id);
        if (report == null) return NotFound(new { message = "Report not found" });

        report.Rating = dto.Rating;
        await _context.SaveChangesAsync();
        return Ok(report);
    }
}
