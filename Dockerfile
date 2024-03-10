
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