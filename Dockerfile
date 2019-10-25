FROM node:8

ENV NODE_ENV=production

COPY ./node_modules /app/node_modules
COPY ./package.json /app/package.json
COPY ./dist /app/dist
WORKDIR /app

ENTRYPOINT ["node","dist/index.js"]