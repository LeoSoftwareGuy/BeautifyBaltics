namespace BeautifyBaltics.Domain.Aggregates.Master.Events;

public record MasterJobFeaturedImageFramed(
    Guid MasterId,
    Guid MasterJobId,
    double FocusX,
    double FocusY,
    double Zoom
);
