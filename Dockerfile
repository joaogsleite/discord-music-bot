FROM node:16

WORKDIR /usr/src/app

RUN apt update && \
    apt install -y ffmpeg

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]