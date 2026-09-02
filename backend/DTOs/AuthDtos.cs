namespace OGDCLInternPortal.API.DTOs;

public record LoginRequest(string Email, string Password);

public record LoginResponse(
    string Token,
    int Id,
    string Name,
    string Email,
    string Role, // "supervisor" | "intern"
    string? Department,
    string? Designation
);

public record CreateInternRequest(
    string Name,
    string Email,
    string Phone,
    string Department,
    string? University,
    string? Degree,
    string? Cgpa,
    DateOnly? StartDate,
    DateOnly? EndDate,
    int? SupervisorId
);
