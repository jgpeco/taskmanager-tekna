FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g ts-node

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 4000

ENTRYPOINT ["sh", "./entrypoint.sh"]