namespace BeautifyBaltics.Integrations.Notifications.CustomHtmlPlaceholders
{
    public static class CustomHtml
    {
        public static string BuildVerificationEmailHtml(string firstName, string verificationLink) => $"""
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hi {firstName}, welcome to BeautifyBaltics!</h2>
            <p>Please verify your email address to activate your account.</p>
            <p>
                <a href="{verificationLink}"
                   style="background-color: #e91e8c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Verify Email
                </a>
            </p>
            <p style="color: #666; font-size: 14px;">This link expires in 24 hours. If you did not create an account, please ignore this email.</p>
        </div>
        """;

        public static string BuildPasswordResetEmailHtml(string firstName, string resetLink) => $"""
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hi {firstName}, reset your password</h2>
            <p>We received a request to reset your BeautifyBaltics password.</p>
            <p>
                <a href="{resetLink}"
                   style="background-color: #e91e8c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Reset Password
                </a>
            </p>
            <p style="color: #666; font-size: 14px;">This link expires in 2 hours. If you did not request a password reset, please ignore this email.</p>
        </div>
        """;
    }
}
