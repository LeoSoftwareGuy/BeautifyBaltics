using BeautifyBaltics.Domain.Exceptions;
using FluentValidation;
using Marten.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace BeautifyBaltics.Core.API.Middlewares
{
    public class ExceptionToProblemDetailsHandler : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            var details = exception.MapToProblemDetails();

            httpContext.Response.StatusCode = details.Status ?? StatusCodes.Status500InternalServerError;

            var service = httpContext.RequestServices.GetService<IProblemDetailsService>();

            if (service is null) throw new InvalidOperationException("ProblemDetails service is not registered.");

            await service.WriteAsync(new ProblemDetailsContext { HttpContext = httpContext, ProblemDetails = details, }).ConfigureAwait(false);

            return true;
        }
    }

    public static class ExceptionHandlingMiddleware
    {
        public static IServiceCollection AddDefaultExceptionHandler(this IServiceCollection serviceCollection) =>
            serviceCollection
                .AddSingleton<IExceptionHandler>(new ExceptionToProblemDetailsHandler())
                .AddProblemDetails();
    }

    public static class ProblemDetailsExtensions
    {
        public static ProblemDetails MapToProblemDetails(this Exception exception)
        {
            var statusCode = exception switch
            {
                ArgumentException => StatusCodes.Status400BadRequest,
                DocumentAlreadyExistsException => StatusCodes.Status400BadRequest,
                ValidationException => StatusCodes.Status422UnprocessableEntity,
                DomainException => StatusCodes.Status400BadRequest,
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                InvalidOperationException => StatusCodes.Status403Forbidden,
                NotFoundException => StatusCodes.Status404NotFound,
                NotImplementedException => StatusCodes.Status501NotImplemented,
                _ => StatusCodes.Status500InternalServerError
            };

            return exception.MapToProblemDetails(statusCode);
        }

        public static ProblemDetails MapToProblemDetails(
            this Exception exception,
            int statusCode,
            string? title = null,
            string? detail = null
        )
        {
            if (exception is ValidationException validationException)
            {
                var errors = validationException.Errors
                    .DistinctBy(x => x.PropertyName)
                    .ToDictionary(x => x.PropertyName, x => new[] { x.ErrorMessage });
                return new ValidationProblemDetails(errors) { Status = statusCode, Detail = detail ?? validationException.Message, };
            }

            return new ProblemDetails { Title = title ?? exception.GetType().Name, Detail = detail ?? exception.Message, Status = statusCode };
        }
    }
}
