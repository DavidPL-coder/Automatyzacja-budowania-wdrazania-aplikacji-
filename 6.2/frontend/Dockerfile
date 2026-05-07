FROM alpine AS builder
WORKDIR /app
COPY . .

FROM nginx:alpine

ARG NGINX_VERSION
LABEL version=$NGINX_VERSION

COPY --from=builder /app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf