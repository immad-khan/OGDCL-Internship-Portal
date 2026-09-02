namespace OGDCLInternPortal.API.DTOs;

public record MessageCreateDto(
    int InternId,
    string SenderName,
    string Role, // "supervisor" | "intern"
    string Content
);
