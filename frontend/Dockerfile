FROM node:lts-alpine

ARG APP_API_URL
ENV REACT_APP_API_URL=$APP_API_URL

WORKDIR /home/node/app
COPY . .
RUN npm i --production && npm run build
CMD npm run start:prd