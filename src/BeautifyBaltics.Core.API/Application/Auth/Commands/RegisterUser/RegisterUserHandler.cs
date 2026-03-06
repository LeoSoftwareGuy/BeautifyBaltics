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
            var normalizedEmail = request.Email.Trim();

            var existingUser = await userRepository.GetByEmailAsync(normalizedEmail, request.Role, cancellationToken);

            if (existingUser is not null) throw DomainException.WithMessage("An account with this email already exists for this account type.");

            if (await userRepository.ExistsByPhoneNumberAsync(request.PhoneNumber, cancellationToken))
            {
                throw DomainException.WithMessage("An account with this phone number already exists.");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var userId = CombGuidIdGeneration.NewGuid();

            var userAccount = new User(
                id: userId,
                email: normalizedEmail,
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
                    Contacts: new Domain.ValueObjects.ContactInformation(normalizedEmail, request.PhoneNumber),
                    UserId: userId
                );

                session.Events.StartStream<ClientAggregate>(clientCreatedEvent);
            }
            else
            {
                var masterCreatedEvent = new MasterCreated(
                   FirstName: request.FirstName,
                   LastName: request.LastName,
                   Contacts: new Domain.ValueObjects.ContactInformation(normalizedEmail, request.PhoneNumber),
                   UserId: userId
               );

                session.Events.StartStream<MasterAggregate>(masterCreatedEvent);

                var existingClientAccount = await userRepository.GetByEmailAsync(normalizedEmail, UserRole.Client, cancellationToken);
                if (existingClientAccount is null)
                {
                    var clientUserId = CombGuidIdGeneration.NewGuid();

                    var clientUserAccount = new User(
                        id: clientUserId,
                        email: normalizedEmail,
                        passwordHash: passwordHash,
                        role: UserRole.Client,
                        firstName: request.FirstName,
                        lastName: request.LastName,
                        phoneNumber: request.PhoneNumber
                    );

                    session.Insert(clientUserAccount);

                    session.Events.StartStream<ClientAggregate>(new ClientCreated(
                        FirstName: request.FirstName,
                        LastName: request.LastName,
                        Contacts: new Domain.ValueObjects.ContactInformation(normalizedEmail, request.PhoneNumber),
                        UserId: clientUserId
                    ));
                }
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
