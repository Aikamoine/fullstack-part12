# The first FROM is now a stage called build-stage
FROM node:16 AS build-stage

ENV REACT_APP_BACKEND_URL=http://localhost:8080/api/
WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN CI=true npm test

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "build"]