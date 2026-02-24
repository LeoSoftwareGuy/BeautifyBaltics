using BeautifyBaltics.Core.API.Application.Auth.Commands.SendVerificationEmail;
using BeautifyBaltics.Core.API.Authentication.SeedWork;
using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Aggregates.Client.Events;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Documents.User;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.User;
using JasperFx.Core;
using Marten;
using Wolverine;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.RegisterUser
{
    public class RegisterUserHandler(
        IUserRepository userRepository,
        IDocumentSession session,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor
    )
    {
        public async Task<(RegisterUserResponse, OutgoingMessages)> Handle(RegisterUserRequest request, CancellationToken cancellationToken)
        {
            var existingUser = await userRepository.GetByEmail(request.Email, cancellationToken);

            if (existingUser is not null) throw DomainException.WithMessage("An account with this email already exists.");

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var userId = CombGuidIdGeneration.NewGuid();

            var userAccount = new User(
                id: userId,
                email: request.Email,
                passwordHash: passwordHash,
                role: request.Role,
                firstName: request.FirstName,
                lastName: request.LastName,
                phoneNumber: request.PhoneNumber
            );

            session.Insert(userAccount);

            if (request.Role == UserRole.Client)
            {
                var clientCreatedEvent = new ClientCreated(
                    FirstName: request.FirstName,
                    LastName: request.LastName,
                    Contacts: new Domain.ValueObjects.ContactInformation(request.Email, request.PhoneNumber),
                    UserId: userId
                );

                session.Events.StartStream<ClientAggregate>(clientCreatedEvent);
            }
            else
            {
                var masterCreatedEvent = new MasterCreated(
                   FirstName: request.FirstName,
                   LastName: request.LastName,
                   Contacts: new Domain.ValueObjects.ContactInformation(request.Email, request.PhoneNumber),
                   UserId: userId
               );

                session.Events.StartStream<MasterAggregate>(masterCreatedEvent);
            }

            var token = Helpers.GenerateSecureToken();

            var verificationToken = new EmailVerificationToken(
                id: CombGuidIdGeneration.NewGuid(),
                userId: userId,
                token: token,
                expiresAt: DateTimeOffset.UtcNow.AddDays(1)
            );

            session.Insert(verificationToken);

            await session.SaveChangesAsync(cancellationToken);

            var appUrl = Helpers.GetAppUrl(configuration, httpContextAccessor);

            var outgoing = new OutgoingMessages
            {
                new SendVerificationEmailCommand(request.Email, request.FirstName, token, appUrl)
            };

            return (new RegisterUserResponse("Registration successful. Please check your email to verify your account."), outgoing);
        }
    }
}
