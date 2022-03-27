FROM node:16

WORKDIR /usr/src/app

RUN apt update && \
    apt install -y apt-transport-https curl && \
    curl -fsSLo /usr/share/keyrings/brave-browser-archive-keyring.gpg https://brave-browser-apt-release.s3.brave.com/brave-browser-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/brave-browser-archive-keyring.gpg arch=amd64] https://brave-browser-apt-release.s3.brave.com/ stable main" | tee /etc/apt/sources.list.d/brave-browser-release.list && \
    apt update && \
    apt install -y brave-browser && \
    apt install -y ffmpeg x11vnc xvfb

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x /usr/src/app/scripts/entrypoint.sh

ENV DISPLAY=":1"

ENTRYPOINT "/usr/src/app/scripts/entrypoint.sh"