# Build stage
FROM node:18 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ../../nginx/default.conf /etc/nginx/conf.d/default.conf
