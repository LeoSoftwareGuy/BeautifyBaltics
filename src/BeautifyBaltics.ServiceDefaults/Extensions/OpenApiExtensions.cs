using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Scalar.AspNetCore;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace BeautifyBaltics.ServiceDefaults.Extensions
{
    public sealed class OpenApiOptions
    {
        public IList<(string Name, OpenApiInfo Info)> Docs { get; } = new List<(string, OpenApiInfo)>();
        public IList<Assembly> Assemblies { get; set; } = new List<Assembly>();
    }

    public sealed class OpenApiUIOptions
    {
        public string Path { get; set; } = "/docs";
        public IList<ScalarDocument> Documents { get; set; } = new List<ScalarDocument>();
        public string Title { get; set; } = "API Docs";
        public ScalarTheme Theme { get; set; } = ScalarTheme.Kepler;
    }

    public static class OpenApiExtensions
    {
        public static IServiceCollection AddOpenApi(this IServiceCollection services, Action<OpenApiOptions> configure)
        {
            var opts = new OpenApiOptions();
            configure(opts);

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(o => ConfigureSwagger(o, opts));
            return services;
        }

        public static WebApplicationBuilder AddOpenApi(this WebApplicationBuilder builder, Action<OpenApiOptions> configure)
        {
            builder.Services.AddOpenApi(configure);
            return builder;
        }

        public static WebApplication UseOpenApiUI(this WebApplication app, Action<OpenApiUIOptions> configure)
        {
            var opts = new OpenApiUIOptions();
            configure(opts);

            app.UseSwagger(c => c.RouteTemplate = "openapi/{documentName}.{json, yaml}");

            app.MapScalarApiReference(opts.Path, o =>
            {
                o.AddDocuments(opts.Documents).WithTitle(opts.Title).WithTheme(opts.Theme);
            });

            return app;
        }

        private static void ConfigureSwagger(SwaggerGenOptions o, OpenApiOptions opts)
        {
            foreach ((string name, OpenApiInfo info) in opts.Docs) o.SwaggerDoc(name, info);

            o.DocInclusionPredicate((doc, api) =>
                string.Equals(api.GroupName, doc, StringComparison.OrdinalIgnoreCase));

            foreach (var asm in opts.Assemblies.Distinct())
            {
                var xml = Path.Combine(AppContext.BaseDirectory, asm.GetName().Name + ".xml");
                if (File.Exists(xml)) o.IncludeXmlComments(xml, includeControllerXmlComments: true);
            }

            o.DescribeAllParametersInCamelCase();
            o.UseAllOfForInheritance();
            o.SelectSubTypesUsing(baseType =>
                opts.Assemblies
                    .SelectMany(a => a.GetTypes())
                    .Where(t => t.IsSubclassOf(baseType) && (t.IsPublic || t.IsNestedPublic)));

            o.MapType<DateOnly>(() => new OpenApiSchema { Type = "string" });
        }
    }
}
