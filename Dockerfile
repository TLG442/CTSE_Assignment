FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production


# Copy the rest of the code
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]