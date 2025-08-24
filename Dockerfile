FROM node:16

RUN mkdir -p /home/app

COPY . /home/app

EXPOSE 8080

CMD ["node", "/home/app/dist/server.js"]