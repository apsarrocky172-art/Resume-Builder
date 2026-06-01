# Backend Server Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Build TypeScript to Javascript
RUN npm run build

# Expose API server port
EXPOSE 5000

# Start compiled server
CMD ["npm", "start"]
