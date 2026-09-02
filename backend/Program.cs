using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OGDCLInternPortal.API.Data;
using OGDCLInternPortal.API.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add DbContext with Npgsql (Supabase PostgreSQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. Register Application Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddTransient<IEmailService, EmailService>();

// 3. Add Authentication & JWT Bearer
var secret = builder.Configuration["Jwt:Secret"] ?? "OGDCL_SUPER_SECRET_JWT_KEY_2024_MUST_BE_AT_LEAST_32_BYTES_LONG!";
var issuer = builder.Configuration["Jwt:Issuer"] ?? "OGDCLInternPortalAPI";
var audience = builder.Configuration["Jwt:Audience"] ?? "OGDCLInternPortalClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ClockSkew = TimeSpan.Zero
    };
});

// 4. Configure CORS for Frontend Integration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:3002",
                "https://localhost:3000"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 5. Add Controllers
builder.Services.AddControllers();

var app = builder.Build();

// Auto-create database tables on startup if not already created via SQL migration
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        dbContext.Database.EnsureCreated();
        
        // Ensure single hardcoded supervisor Ishtiaque Butt exists
        var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
        var supervisor = dbContext.Supervisors.FirstOrDefault();
        if (supervisor == null)
        {
            supervisor = new OGDCLInternPortal.API.Models.Supervisor
            {
                Name = "Ishtiaque Butt",
                Email = "immadonline702@gmail.com",
                PasswordHash = authService.HashPassword("S!ddeeq5696"),
                Designation = "Senior Manager HR & Training",
                Department = "HR & Administration",
                Phone = "+92 51 9200000",
                Region = "Islamabad HQ"
            };
            dbContext.Supervisors.Add(supervisor);
            dbContext.SaveChanges();
            Console.WriteLine("[DB SEED] Created supervisor: Ishtiaque Butt (immadonline702@gmail.com / S!ddeeq5696)");
        }
        else
        {
            supervisor.Name = "Ishtiaque Butt";
            supervisor.Email = "immadonline702@gmail.com";
            dbContext.SaveChanges();
            Console.WriteLine("[DB SYNC] Updated supervisor name to: Ishtiaque Butt");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DB INIT NOTICE] Database ensure created: {ex.Message}");
    }
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Ok(new
{
    service = "OGDCL Internship Management System API",
    status = "Running",
    framework = ".NET 10",
    database = "Supabase PostgreSQL",
    emailService = "Configured (Gmail SMTP)"
}));

app.Run();
