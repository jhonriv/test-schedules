FROM node:22.7.0-alpine3.19

ENV HOST=0.0.0.0

ENV PORT=2426

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm ci --dev

RUN mkdir -p /app/build/tmp

WORKDIR /app/build

RUN node ace migration:run

WORKDIR /app

EXPOSE 2426

CMD ["npm", "start"]