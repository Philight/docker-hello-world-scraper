#FROM node:16-buster-slim AS ui-build
#WORKDIR /c/WORKSPACE/WEB/luxonis/luxonis-scraper-win
#COPY client/ ./client/
#RUN cd client && npm install && npm run build

#FROM node:16-buster-slim AS server-build
#WORKDIR /root/
#COPY --from=ui-build /c/WORKSPACE/WEB/luxonis/luxonis-scraper-win/client/build ./client/build
#COPY server/package*.json ./server/
#RUN cd server && npm install
#COPY server/server.js ./server/

#EXPOSE 8080

#CMD ["node", "./server/server.js"]