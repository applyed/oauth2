FROM node:lts-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
ENV PERMISSIONS_FILE="/app/config/acl.json"
ENV DB_CONN_STR="sqlite:/app/config/db.sqlite"
ENV SESSION_SECRET="keyboard cat"

VOLUME /app/config
CMD ["npm", "start"]