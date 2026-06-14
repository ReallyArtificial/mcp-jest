# Multi-stage Dockerfile for mcp-jest
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S mcpjest && \
    adduser -S -u 1001 -G mcpjest mcpjest

WORKDIR /app

# Copy built artifacts and necessary files from builder
COPY --from=builder --chown=mcpjest:mcpjest /app/dist ./dist
COPY --from=builder --chown=mcpjest:mcpjest /app/package*.json ./
COPY --from=builder --chown=mcpjest:mcpjest /app/README.md ./
COPY --from=builder --chown=mcpjest:mcpjest /app/llms.txt ./
COPY --from=builder --chown=mcpjest:mcpjest /app/llms-full.txt ./

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Switch to non-root user
USER mcpjest

# Make CLI executable globally available
ENV PATH="/app/dist:${PATH}"

# Healthcheck - verify the CLI is accessible
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('./dist/cli.js')" || exit 1

# Default command: show help
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "/app/dist/cli.js", "--help"]
