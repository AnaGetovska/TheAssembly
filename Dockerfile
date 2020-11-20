FROM node:12
WORKDIR /usr/src/app
COPY assembly/package*.json ./
RUN npm install
COPY ./assembly /usr/src/app
EXPOSE 3000
CMD [ "npm", "start" ]