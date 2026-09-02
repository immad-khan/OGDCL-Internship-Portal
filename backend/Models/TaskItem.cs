using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OGDCLInternPortal.API.Models;

[Table("tasks")]
public class TaskItem
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("intern_id")]
    public int InternId { get; set; }

    [ForeignKey(nameof(InternId))]
    public Intern? Intern { get; set; }

    [Required]
    [Column("title")]
    public string Title { get; set; } = string.Empty;

    [Column("description")]
    public string? Description { get; set; }

    [Column("category")]
    public string Category { get; set; } = "General";

    [Column("priority")]
    public string Priority { get; set; } = "medium"; // low, medium, high, urgent

    [Column("status")]
    public string Status { get; set; } = "todo"; // todo, in_progress, review, completed

    [Column("due_date")]
    public DateOnly? DueDate { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
