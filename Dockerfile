# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Production environment
FROM node:18-alpine
WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the production-ready server and build artifacts
COPY --from=builder /app/dist ./dist
COPY server.js .
COPY certs ./certs

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["npm", "start"]
