#FROM node:20.11.1
#
## Set the working directory
#WORKDIR /usr/src/app
#
## Copy package.json and package-lock.json
#COPY package*.json ./
#
## Install dependencies
#RUN npm install
#
## Copy the application files
#COPY . .
#
## Expose the port
#EXPOSE 5001
#
## Start the application
##CMD [ "node", "app.js" ]
FROM node:20.11.1

ENV TIMEZONE Europe/Kiev

RUN apt-get update && apt-get install -y \
    git \
    mc

# set working directory
WORKDIR /usr/app

# add `/usr/app/node_modules/.bin` to $PATH
ENV PATH /node_modules/.bin:$PATH

EXPOSE 5001