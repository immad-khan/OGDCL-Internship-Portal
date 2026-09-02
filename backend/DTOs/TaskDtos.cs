namespace OGDCLInternPortal.API.DTOs;

public record TaskCreateDto(
    int InternId,
    string Title,
    string? Description,
    string Category,
    string Priority, // low, medium, high, urgent
    string Status,   // todo, in_progress, review, completed
    DateOnly? DueDate
);

public record TaskUpdateDto(
    string Title,
    string? Description,
    string Category,
    string Priority,
    string Status,
    DateOnly? DueDate
);

public record TaskStatusUpdateDto(string Status);
