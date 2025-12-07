# Use the official Bun image
FROM oven/bun:1-alpine AS base
# Set working directory
WORKDIR /app

FROM base AS prepare
RUN bun add -g turbo
COPY . .
RUN turbo prune payments --docker

FROM base AS deps
COPY --from=prepare /app/out/json/ .
RUN bun install --frozen-lockfile --production

FROM base AS runner

COPY --from=deps /app/node_modules ./node_modules
COPY --from=prepare /app/apps/payments/src ./src
COPY --from=prepare /app/apps/payments/package.json ./

ENV NODE_ENV=production

USER bun
CMD ["bun", "run", "src/index.ts"]
