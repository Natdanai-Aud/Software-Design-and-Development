FROM node:24-alpine AS build
WORKDIR /app/bkk-risk-api
COPY bkk-risk-api/package*.json ./
RUN npm ci
COPY bkk-risk-api/ ./
RUN npm run build

FROM node:24-alpine AS production
WORKDIR /app/bkk-risk-api
ENV NODE_ENV=production
COPY --from=build /app/bkk-risk-api/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/bkk-risk-api/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]