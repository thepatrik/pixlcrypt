FROM node:10-alpine

COPY package.json package-lock.json ./

RUN npm install --production

COPY ./lib ./lib

ENV NODE_ENV=production

EXPOSE 5000

CMD [ "npm", "start" ]
