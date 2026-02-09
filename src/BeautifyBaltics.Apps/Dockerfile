# Stage 1: Build the app
FROM node:20 as build

# Name of the app to build
ARG APP_NAME

# API URL baked into the JS bundle at build time
ARG VITE_CORE_API_URL
ENV VITE_CORE_API_URL=$VITE_CORE_API_URL

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) files
COPY src/BeautifyBaltics.Apps/package*.json ./

# Install dependencies
RUN npm install

# Copy the Nx workspace files
COPY src/BeautifyBaltics.Apps/ .

# Build the back-office app
RUN npx nx build $APP_NAME --prod

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Name of the app to build
ARG APP_NAME

# Install CA certificates so nginx can trust outbound HTTPS targets (Azure Container Apps backend)
RUN apk add --no-cache ca-certificates && update-ca-certificates

# Port for nginx to listen on (used by default.conf.template via envsubst)
ENV PORT=8080

# Copy built files to Nginx web directory
COPY --from=build /app/nginx /etc/nginx
COPY --from=build /app/dist/apps/$APP_NAME /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
