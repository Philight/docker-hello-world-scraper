FROM node:16-buster-slim

RUN mkdir -p /opt/luxonis-scraper/client

#WORKDIR c/WORKSPACE/WEB/luxonis/luxonis-scraper-win/client
WORKDIR /opt/luxonis-scraper/client

COPY ["package*.json", "tsconfig.json", ".env", "./"]
COPY ./public ./public
COPY ./src ./src

RUN npm install

CMD ["npm", "run", "build"]


EXPOSE 8080

CMD ["npm", "run", "start"]