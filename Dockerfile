FROM node:lts-alpine
ENV NODE_ENV=production
ENV BOT_TOKEN ""
ENV GITHUB_ACCESS_TOKEN ""
ENV GUILD_ID ""
ENV GITHUB_USERNAME ""
ENV GITHUB_REPOSITORY ""
WORKDIR /usr/src/app 
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
