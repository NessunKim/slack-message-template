# Use Node 20 base image
FROM node:20-alpine AS base
WORKDIR /app

# Enable Corepack and set Yarn version
RUN corepack enable && corepack prepare yarn@4.9.1 --activate

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy source code
COPY . .

# Start server
CMD ["yarn", "tsx", "src/server.ts"] 
