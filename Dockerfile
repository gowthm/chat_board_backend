FROM node:18

# app location
WORKDIR /user/src/app

# dependencies

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]