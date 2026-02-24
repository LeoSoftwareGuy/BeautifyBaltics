using BeautifyBaltics.Domain.Documents.User;
using BeautifyBaltics.Domain.Exceptions;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Auth.Commands.ResetPassword
{
    public class ResetPasswordHandler(IDocumentSession session)
    {
        public async Task<ResetPasswordResponse> Handle(ResetPasswordRequest request, CancellationToken cancellationToken)
        {
            var resetToken = await session.Query<PasswordResetToken>()
                .FirstOrDefaultAsync(x => x.Token == request.Token, cancellationToken);

            if (resetToken is null || !resetToken.IsValid()) throw DomainException.WithMessage("Invalid or expired reset token.");

            var userAccount = await session.LoadAsync<User>(resetToken.UserId, cancellationToken)
                ?? throw DomainException.WithMessage("User not found.");

            userAccount.UpdatePasswordHash(BCrypt.Net.BCrypt.HashPassword(request.NewPassword));
            resetToken.MarkUsed();

            session.Update(userAccount);
            session.Update(resetToken);
            await session.SaveChangesAsync(cancellationToken);

            return new ResetPasswordResponse("Password reset successfully.");
        }
    }
}
