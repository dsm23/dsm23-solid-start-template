# syntax=docker.io/docker/dockerfile:1@sha256:2780b5c3bab67f1f76c781860de469442999ed1a0d7992a5efdf2cffc0e3d769

FROM ghcr.io/pnpm/pnpm:11.1.1 AS base
FROM dhi.io/node:26.1.0-alpine3.23@sha256:89ba306d54a9025da2e7862ff22ae13a95d825a0e459217138242115dfc700a5 AS runtime

# renovate: datasource=docker depName=dhi.io/node
ARG NODE_VERSION="26.1.0"

# Stage 1: Install dependencies only when needed
FROM base AS deps

WORKDIR /app

ENV LEFTHOOK=0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm runtime set node "$NODE_VERSION" -g && pnpm install --frozen-lockfile

# Stage 2: Install production dependencies only when needed
FROM base AS prod-deps

WORKDIR /app

ENV LEFTHOOK=0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm runtime set node "$NODE_VERSION" -g && pnpm install --production --frozen-lockfile

# Stage 3: Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

ENV CI=true

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm runtime set node "$NODE_VERSION" -g \
  && pnpm run build

# Stage 4: Production image, copy all the files and run next
FROM runtime
WORKDIR /app

ENV NODE_ENV=production

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/.vinxi ./vinxi

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["./node_modules/.bin/vinxi", "start"]
