FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/types/package*.json ./packages/types/

# Install dependencies
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build backend
RUN npm run build --workspace=@izzzi/backend

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built files
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

USER nestjs

EXPOSE 4000

CMD ["node", "dist/main"]

