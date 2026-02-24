# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci --only=production
RUN cd client && npm ci --only=production

# Copy source code
COPY . .

# Build frontend
RUN cd client && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy dependencies and built files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/client/build ./client/build
COPY --from=builder /app/package*.json ./
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
