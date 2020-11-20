FROM node:12
WORKDIR /usr/src/app
COPY assembly/package*.json ./
RUN npm install
COPY ./assembly ./
EXPOSE 3000
RUN ls -la
CMD [ "npm", "start" ]