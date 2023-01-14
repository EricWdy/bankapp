FROM node:18-slim

LABEL org.opencontainers.image.authors="wangdaoyuanideal@hotmail.com"

WORKDIR /app

# COPY CODE, dependencies and RUN INSTALL

COPY index.js /app/index.js
COPY package.json /app/package.json
COPY admin.js /app/admin.js
COPY dal.js /app/dal.js
COPY ./public/ /app/public/

EXPOSE 3001

RUN npm install