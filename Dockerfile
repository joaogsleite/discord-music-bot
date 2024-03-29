FROM node:16

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y build-essential wget gnupg x11vnc xvfb unzip ffmpeg \
    #&& wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    #&& sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y chromium fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x /usr/src/app/scripts/entrypoint.sh

ENV DISPLAY=":1"

ENTRYPOINT "/usr/src/app/scripts/entrypoint.sh"