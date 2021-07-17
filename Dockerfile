FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD [ "node", "index.js" ]

# At the end, set the user to use when running this image
USER node
