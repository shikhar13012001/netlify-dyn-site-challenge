# Install dependencies only when needed
FROM node:slim AS deps
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt-get update && \
    apt-get install -y libc6 && \
    apt-get install -y git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM node:slim AS builder
# add environment variables to client code
ARG NEXT_PUBLIC_BACKEND_URL

ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
ARG NODE_ENV=production
RUN echo ${NODE_ENV}
RUN NODE_ENV=${NODE_ENV} npm run build

# Production image, copy all the files and run next
FROM node:slim AS runner
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

WORKDIR /app

# Create a non-root user
RUN useradd -m nextjs -u 1001

RUN apt-get update && apt-get install -y gnupg wget && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
  apt-get update && \
  apt-get install -y google-chrome-stable --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# You only need to copy next.config.js if you are NOT using the default configuration.
# Copy all necessary files used by nex.config as well otherwise the build will fail

COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env.local ./.env.local

USER nextjs

# Expose
EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1
CMD ["npm", "start"]
