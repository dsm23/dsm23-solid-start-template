# syntax=docker.io/docker/dockerfile:1@sha256:87999aa3d42bdc6bea60565083ee17e86d1f3339802f543c0d03998580f9cb89

FROM ghcr.io/pnpm/pnpm:11.2.2@sha256:3ddc2f59b99aab0c1f7ca9da3e7596c414bcfdc1de76bbd9117343d08385fec8 AS base
FROM dhi.io/node:26.1.0-alpine3.23@sha256:89ba306d54a9025da2e7862ff22ae13a95d825a0e459217138242115dfc700a5 AS runtime

# renovate: datasource=docker depName=dhi.io/node
ARG NODE_VERSION="26.2.0"

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
COPY --from=prod-deps /app/node_modules ./node_modules/
COPY --from=builder /app/.output ./.output/
COPY --from=builder /app/.vinxi ./vinxi/

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "./node_modules/vinxi/bin/cli.mjs", "start"]
