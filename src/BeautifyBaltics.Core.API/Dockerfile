FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore
COPY src/BeautifyBaltics.Core.API/BeautifyBaltics.Core.API.csproj src/BeautifyBaltics.Core.API/
COPY src/BeautifyBaltics.Domain/BeautifyBaltics.Domain.csproj src/BeautifyBaltics.Domain/
COPY src/BeautifyBaltics.Infrastructure/BeautifyBaltics.Infrastructure.csproj src/BeautifyBaltics.Infrastructure/
COPY src/BeautifyBaltics.Persistence/BeautifyBaltics.Persistence.csproj src/BeautifyBaltics.Persistence/
COPY src/BeautifyBaltics.ServiceDefaults/BeautifyBaltics.ServiceDefaults.csproj src/BeautifyBaltics.ServiceDefaults/
COPY src/Integrations/BeautifyBaltics.Integrations.BlobStorage/BeautifyBaltics.Integrations.BlobStorage.csproj src/Integrations/BeautifyBaltics.Integrations.BlobStorage/
COPY src/Integrations/BeautifyBaltics.Integrations.Notifications/BeautifyBaltics.Integrations.Notifications.csproj src/Integrations/BeautifyBaltics.Integrations.Notifications/
COPY Directory.Build.props ./
RUN dotnet restore src/BeautifyBaltics.Core.API/BeautifyBaltics.Core.API.csproj

# Copy source and publish
COPY src/BeautifyBaltics.Core.API/ src/BeautifyBaltics.Core.API/
COPY src/BeautifyBaltics.Domain/ src/BeautifyBaltics.Domain/
COPY src/BeautifyBaltics.Infrastructure/ src/BeautifyBaltics.Infrastructure/
COPY src/BeautifyBaltics.Persistence/ src/BeautifyBaltics.Persistence/
COPY src/BeautifyBaltics.ServiceDefaults/ src/BeautifyBaltics.ServiceDefaults/
COPY src/Integrations/ src/Integrations/
RUN dotnet publish src/BeautifyBaltics.Core.API/BeautifyBaltics.Core.API.csproj -c Release -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BeautifyBaltics.Core.API.dll"]
