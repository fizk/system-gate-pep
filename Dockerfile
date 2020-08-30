FROM node:14.8.0-stretch

RUN apt-get update; \
    apt-get install -y \
    vim

WORKDIR /app

COPY ./package*.json /app/

RUN npm i --no-optional --no-audit --only=prod

COPY ./build /app/src

CMD ["./node_modules/.bin/forever", "--spinSleepTime", "1000", "--minUptime", "1000", "--fifo", "./src/index.js"]
