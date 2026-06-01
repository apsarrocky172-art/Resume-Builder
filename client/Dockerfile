# Frontend Client Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Expose Vite development port
EXPOSE 3000

# Start Vite server in host mode
CMD ["npm", "run", "dev"]
