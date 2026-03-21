# MARK: Builder image

FROM node:24-alpine AS builder-stage

WORKDIR /builder

RUN corepack enable pnpm

# Catch VITE_SERVER_URL at build time for `vite build` to be aware of it
ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build \
  && pnpm prune --prod

# MARK: Runtime image

FROM node:24-alpine AS runner-stage

WORKDIR /runner

RUN corepack enable pnpm
ENV NODE_ENV=production

# Only copy the essential files from the builder stage
COPY --from=builder-stage /builder/.output ./.output
COPY --from=builder-stage /builder/node_modules ./node_modules
COPY --from=builder-stage /builder/package.json ./package.json

CMD ["pnpm", "run", "start"]
