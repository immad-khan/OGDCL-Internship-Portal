using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OGDCLInternPortal.API.Data;
using OGDCLInternPortal.API.DTOs;
using OGDCLInternPortal.API.Models;

namespace OGDCLInternPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly AppDbContext _context;

    public MessagesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMessages([FromQuery] int? internId)
    {
        var query = _context.Messages.AsQueryable();

        if (internId.HasValue && internId.Value > 0)
        {
            query = query.Where(m => m.InternId == internId.Value);
        }

        var list = await query
            .OrderBy(m => m.CreatedAt)
            .Select(m => new {
                m.Id,
                m.InternId,
                m.SenderName,
                m.Role,
                m.Content,
                m.IsRead,
                m.CreatedAt
            })
            .ToListAsync();

        return Ok(list);
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] MessageCreateDto dto)
    {
        var msg = new MessageItem
        {
            InternId = dto.InternId,
            SenderName = dto.SenderName,
            Role = dto.Role,
            Content = dto.Content,
            IsRead = false
        };

        _context.Messages.Add(msg);
        await _context.SaveChangesAsync();

        return Ok(msg);
    }

    [HttpPatch("read")]
    public async Task<IActionResult> MarkAsRead([FromQuery] int internId, [FromQuery] string role)
    {
        // Mark messages sent by the opposite role as read
        var targetRole = role.ToLower() == "supervisor" ? "intern" : "supervisor";

        var unreadMsgs = await _context.Messages
            .Where(m => m.InternId == internId && m.Role.ToLower() == targetRole && !m.IsRead)
            .ToListAsync();

        foreach (var m in unreadMsgs)
        {
            m.IsRead = true;
        }

        await _context.SaveChangesAsync();
        return Ok(new { markedCount = unreadMsgs.Count });
    }
}
