FROM node:latest

RUN mkdir /code
WORKDIR /code

RUN apt-get update
RUN apt-get install netcat -y

COPY package*.json ./

RUN npm install --quiet

COPY . .

RUN ["chmod", "+x", "/code/entry_point.sh"]

ENTRYPOINT ["/code/entry_point.sh"] 