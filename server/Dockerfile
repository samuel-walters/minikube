FROM node:lts-alpine3.15
WORKDIR /usr/src/server

COPY package.json ./
RUN npm install

COPY . .

# (EXPOSE - Not accessible from outside Docker, but from
# inside other Docker containers.)
# "The EXPOSE instruction does not actually publish the port.
# It functions as a type of documentation between the person who
# builds the image and the person who runs the container."
# See: https://docs.docker.com/engine/reference/builder/#expose
EXPOSE 3000
CMD ["node", "server.js"]