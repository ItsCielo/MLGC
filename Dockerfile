FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY config/service.json /app/config/service.json

EXPOSE 3000

ENV GOOGLE_APPLICATION_CREDENTIALS="/app/config/service.json"

ENV APP_ENV = "local"

CMD ["npm", "start"]