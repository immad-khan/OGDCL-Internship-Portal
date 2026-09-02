using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OGDCLInternPortal.API.Models;

[Table("messages")]
public class MessageItem
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
    [Column("sender_name")]
    public string SenderName { get; set; } = string.Empty;

    [Required]
    [Column("role")]
    public string Role { get; set; } = string.Empty; // 'supervisor' | 'intern'

    [Required]
    [Column("content")]
    public string Content { get; set; } = string.Empty;

    [Column("is_read")]
    public bool IsRead { get; set; } = false;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
