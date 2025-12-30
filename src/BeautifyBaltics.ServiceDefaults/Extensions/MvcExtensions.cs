using BeautifyBaltics.ServiceDefaults.Middlewares;
using BeautifyBaltics.ServiceDefaults.MvcConventions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using System.Text.Json.Serialization;

namespace BeautifyBaltics.ServiceDefaults.Extensions
{
    public sealed class ApiGroup
    {
        public required Assembly Assembly { get; init; }
        public required string GroupName { get; init; }
        public required string RoutePrefix { get; init; }
        public string? AuthScheme { get; init; }
    }

    public sealed class ApiControllersOptions
    {
        public IList<ApiGroup> Groups { get; } = new List<ApiGroup>();
    }

    public static class MvcExtensions
    {
        public static IServiceCollection AddApiControllers(this IServiceCollection services, Action<ApiControllersOptions> configure)
        {
            var opts = new ApiControllersOptions();
            configure(opts);

            var mvc = services.AddControllers(o =>
            {
                o.ReturnHttpNotAcceptable = true;

                o.Filters.Add(new ConsumesAttribute("application/json"));
                o.Filters.Add(new ProducesAttribute("application/json"));
            })
                .AddJsonOptions(o =>
                {
                    o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    o.JsonSerializerOptions.Converters.Add(new DateOnlyJsonConverter());
                });

            mvc.ConfigureApplicationPartManager(apm =>
            {
                var assemblies = opts.Groups.Select(g => g.Assembly).Distinct();
                foreach (var asm in assemblies) apm.ApplicationParts.Add(new AssemblyPart(asm));
            });

            mvc.AddMvcOptions(o =>
            {
                foreach (var g in opts.Groups)
                {
                    //if (g.AuthScheme != null)
                    //{
                    //    o.Conventions.Add(new AuthorizeByDefaultConvention(g.Assembly, g.AuthScheme));
                    //}

                    o.Conventions.Add(new RoutePrefixConvention(g.Assembly, g.GroupName, g.RoutePrefix));
                }
            });

            return services;
        }
    }

}
