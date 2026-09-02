using Microsoft.EntityFrameworkCore;
using OGDCLInternPortal.API.Models;

namespace OGDCLInternPortal.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Supervisor> Supervisors => Set<Supervisor>();
    public DbSet<Intern> Interns => Set<Intern>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
    public DbSet<MessageItem> Messages => Set<MessageItem>();
    public DbSet<Report> Reports => Set<Report>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Supervisors
        modelBuilder.Entity<Supervisor>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Configure Interns
        modelBuilder.Entity<Intern>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasOne(e => e.Supervisor)
                  .WithMany(s => s.Interns)
                  .HasForeignKey(e => e.SupervisorId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure Tasks
        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.HasOne(e => e.Intern)
                  .WithMany(i => i.Tasks)
                  .HasForeignKey(e => e.InternId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Messages
        modelBuilder.Entity<MessageItem>(entity =>
        {
            entity.HasOne(e => e.Intern)
                  .WithMany(i => i.Messages)
                  .HasForeignKey(e => e.InternId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Reports
        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasOne(e => e.Intern)
                  .WithMany(i => i.Reports)
                  .HasForeignKey(e => e.InternId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
