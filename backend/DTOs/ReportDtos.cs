namespace OGDCLInternPortal.API.DTOs;

public record ReportCreateDto(
    int InternId,
    string Title,
    string? Content
);

public record ReportStatusUpdateDto(
    string Status, // draft, submitted, approved, rejected
    string? Feedback
);

public record ReportRatingDto(
    int Rating
);
