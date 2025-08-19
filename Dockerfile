# ---- Stage 1: Build ----
FROM node:lts-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# ---- Stage 2: Production ----
FROM node:lts-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Copy the entrypoint script and make it executable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Expose the port
EXPOSE 3001

# Set the default command that the entrypoint will execute
CMD ["node", "src/server.js"]