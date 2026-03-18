FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Install frontend dependencies and build
COPY client/package*.json ./client/
RUN cd client && npm install

COPY . .
RUN cd client && npm run build

EXPOSE 5000

CMD ["node", "server.js"]
