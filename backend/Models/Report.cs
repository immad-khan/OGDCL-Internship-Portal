using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OGDCLInternPortal.API.Models;

[Table("reports")]
public class Report
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

    [Column("content")]
    public string? Content { get; set; }

    [Column("status")]
    public string Status { get; set; } = "draft"; // draft, submitted, approved, rejected

    [Column("rating")]
    public int? Rating { get; set; } // 1..5

    [Column("feedback")]
    public string? Feedback { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
