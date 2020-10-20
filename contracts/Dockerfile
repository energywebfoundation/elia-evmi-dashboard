FROM node:lts-alpine

RUN apk add curl

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY ./deploy.js ./
COPY ./evd-registry.json ./
COPY --chown=node ./wait-for-node.sh ./

RUN chmod +x ./wait-for-node.sh
RUN npm i ethers

CMD ["./wait-for-node.sh"]
