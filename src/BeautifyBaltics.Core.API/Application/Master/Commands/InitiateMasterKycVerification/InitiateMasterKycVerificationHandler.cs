using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Integrations.Didit;
using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.InitiateMasterKycVerification;

public class InitiateMasterKycVerificationHandler(
    IDiditService diditService,
    IConfiguration configuration
)
{
    [AggregateHandler]
    public async Task<(Events, OutgoingMessages)> Handle(
        InitiateMasterKycVerificationRequest request,
        MasterAggregate master,
        CancellationToken cancellationToken
    )
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);

        if (master.KycStatus == KycStatus.Approved)
        {
            throw DomainException.WithMessage("Identity verification has already been approved.");
        }

        var appUrl = configuration["AppUrl"]?.TrimEnd('/') ?? "http://localhost:4300";
        var callbackUrl = $"{appUrl}/master/kyc";

        var session = await diditService.CreateSessionAsync(
            masterId: master.Id.ToString(),
            callbackUrl: callbackUrl,
            masterEmail: master.Contacts.Email,
            cancellationToken: cancellationToken
        );

        var @event = new MasterKycVerificationInitiated(
            MasterId: master.Id,
            SessionId: session.SessionId,
            VerificationUrl: session.Url,
            InitiatedAt: DateTimeOffset.UtcNow
        );

        return ([@event], [new InitiateMasterKycVerificationResponse(session.Url)]);
    }
}
