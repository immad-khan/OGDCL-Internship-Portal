using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OGDCLInternPortal.API.Models;

[Table("supervisors")]
public class Supervisor
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

    [Column("designation")]
    public string Designation { get; set; } = "Internship Supervisor";

    [Column("department")]
    public string Department { get; set; } = "HR & Administration";

    [Column("phone")]
    public string? Phone { get; set; }

    [Column("region")]
    public string? Region { get; set; } = "Islamabad HQ";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Intern> Interns { get; set; } = new List<Intern>();
}
