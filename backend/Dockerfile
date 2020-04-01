FROM node:lts-alpine
WORKDIR /home/node/app
COPY . .
RUN npm i --production
CMD npx knex migrate:latest && npm start
