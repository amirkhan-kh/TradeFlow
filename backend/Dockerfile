FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund
COPY migrations ./migrations
COPY src ./src
ENV NODE_ENV=production PORT=4000
EXPOSE 4000
USER node
CMD ["npx", "tsx", "src/index.ts"]
