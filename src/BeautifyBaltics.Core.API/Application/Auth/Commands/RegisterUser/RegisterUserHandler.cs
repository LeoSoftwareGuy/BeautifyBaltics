using BeautifyBaltics.Core.API.Application.Auth.Commands.SendVerificationEmail;
using BeautifyBaltics.Core.API.Authentication.SeedWork;
using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Aggregates.Client.Events;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Aggregates.User;
using BeautifyBaltics.Domain.Aggregates.User.Events;
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
            var normalizedEmail = request.Email.Trim().ToLowerInvariant();

            var existingUser = await userRepository.GetByEmailAsync(normalizedEmail, request.Role, cancellationToken);

            if (existingUser is not null) throw DomainException.WithMessage("An account with this email already exists for this account type.");

            if (await userRepository.ExistsByPhoneNumberAsync(request.PhoneNumber, cancellationToken))
            {
                throw DomainException.WithMessage("An account with this phone number already exists.");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var userId = CombGuidIdGeneration.NewGuid();

            StartUserAggregate(
                userId,
                normalizedEmail,
                passwordHash,
                request.FirstName,
                request.LastName,
                request.PhoneNumber,
                request.Role,
                emailVerified: false
            );

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

                    StartUserAggregate(
                        clientUserId,
                        normalizedEmail,
                        passwordHash,
                        request.FirstName,
                        request.LastName,
                        request.PhoneNumber,
                        UserRole.Client,
                        emailVerified: false
                    );

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

        private void StartUserAggregate(
            Guid userId,
            string email,
            string passwordHash,
            string firstName,
            string lastName,
            string phoneNumber,
            UserRole role,
            bool emailVerified)
        {
            session.Events.StartStream<UserAggregate>(userId,
                new UserRegistered(
                    userId,
                    email,
                    firstName,
                    lastName,
                    phoneNumber,
                    role,
                    DateTimeOffset.UtcNow,
                    passwordHash
                ));

            if (emailVerified)
            {
                session.Events.Append(userId, new UserEmailVerified(userId, DateTimeOffset.UtcNow));
            }
        }
    }
}
