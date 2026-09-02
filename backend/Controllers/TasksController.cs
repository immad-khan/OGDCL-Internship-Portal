using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OGDCLInternPortal.API.Data;
using OGDCLInternPortal.API.DTOs;
using OGDCLInternPortal.API.Models;

namespace OGDCLInternPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks([FromQuery] int? internId)
    {
        var query = _context.Tasks.AsQueryable();

        if (internId.HasValue && internId.Value > 0)
        {
            query = query.Where(t => t.InternId == internId.Value);
        }

        var tasks = await query
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new {
                t.Id,
                t.InternId,
                t.Title,
                t.Description,
                t.Category,
                t.Priority,
                t.Status,
                t.DueDate,
                t.CreatedAt
            })
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound(new { message = "Task not found" });

        return Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TaskCreateDto dto)
    {
        var task = new TaskItem
        {
            InternId = dto.InternId,
            Title = dto.Title,
            Description = dto.Description,
            Category = dto.Category ?? "General",
            Priority = dto.Priority ?? "medium",
            Status = dto.Status ?? "todo",
            DueDate = dto.DueDate
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TaskUpdateDto dto)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound(new { message = "Task not found" });

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Category = dto.Category;
        task.Priority = dto.Priority;
        task.Status = dto.Status;
        task.DueDate = dto.DueDate;

        await _context.SaveChangesAsync();
        return Ok(task);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] TaskStatusUpdateDto dto)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound(new { message = "Task not found" });

        task.Status = dto.Status;
        await _context.SaveChangesAsync();

        return Ok(task);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound(new { message = "Task not found" });

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Task deleted" });
    }
}
