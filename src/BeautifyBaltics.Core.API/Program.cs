using BeautifyBaltics.Infrastructure;
using BeautifyBaltics.Persistence;
using BeautifyBaltics.ServiceDefaults;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.AddWolverineDefaults();

builder.Services.AddMartenDefaults(builder.Configuration);
builder.Services.ConfigurePersistence();
builder.Services.AddPersistenceServices();
builder.Services.AddInfrastructureServices();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapDefaultEndpoints();

app.Run();
