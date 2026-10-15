FROM node:22-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY app.js review.js dealership.js ./
COPY data/ ./data/
ENV NODE_ENV=production
EXPOSE 3030
USER node
CMD ["node", "app.js"]
