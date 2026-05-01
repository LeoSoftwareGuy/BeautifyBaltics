using BeautifyBaltics.Domain.Aggregates.User.Events;
using BeautifyBaltics.Domain.Documents.User;
using BeautifyBaltics.Domain.Exceptions;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.ResetPassword
{
    public class ResetPasswordHandler(IDocumentSession session)
    {
        public async Task<ResetPasswordResponse> Handle(ResetPasswordRequest request, CancellationToken cancellationToken)
        {
            var resetToken = await session.Query<PasswordResetToken>().FirstOrDefaultAsync(x => x.Token == request.Token, cancellationToken);

            if (resetToken is null || !resetToken.IsValid()) throw DomainException.WithMessage("Invalid or expired reset token.");

            var userProjection = await session.Query<Persistence.Projections.UserProjection>()
                .FirstOrDefaultAsync(x => x.Id == resetToken.UserId, cancellationToken)
                ?? throw DomainException.WithMessage("User not found.");

            var newHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            resetToken.MarkUsed();

            session.Events.Append(userProjection.Id, new UserPasswordChanged(userProjection.Id, newHash));
            session.Update(resetToken);
            await session.SaveChangesAsync(cancellationToken);

            return new ResetPasswordResponse("Password reset successfully.");
        }
    }
}
