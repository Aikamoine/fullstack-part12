# The first FROM is now a stage called build-stage
FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "build"]