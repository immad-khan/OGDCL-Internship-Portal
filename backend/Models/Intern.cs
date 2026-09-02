using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OGDCLInternPortal.API.Models;

[Table("interns")]
public class Intern
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Column("password_hash")]
    public string PasswordHash { get; set; } = string.Empty;

    [Column("phone")]
    public string? Phone { get; set; }

    [Required]
    [Column("department")]
    public string Department { get; set; } = string.Empty;

    [Column("university")]
    public string? University { get; set; }

    [Column("degree")]
    public string? Degree { get; set; }

    [Column("cgpa")]
    public string? Cgpa { get; set; }

    [Column("start_date")]
    public DateOnly? StartDate { get; set; }

    [Column("end_date")]
    public DateOnly? EndDate { get; set; }

    [Column("status")]
    public string Status { get; set; } = "active";

    [Column("supervisor_id")]
    public int? SupervisorId { get; set; }

    [ForeignKey(nameof(SupervisorId))]
    public Supervisor? Supervisor { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    public ICollection<MessageItem> Messages { get; set; } = new List<MessageItem>();
    public ICollection<Report> Reports { get; set; } = new List<Report>();
}
