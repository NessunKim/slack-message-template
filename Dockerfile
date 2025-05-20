# Use Node 22 base image
FROM node:22-alpine AS base
WORKDIR /app

# Enable Corepack and set Yarn version
RUN corepack enable && corepack prepare yarn@4.9.1 --activate

# Install dependencies
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/
RUN yarn install

# Copy source code
COPY . .

# Start server
CMD ["yarn", "tsx", "src/server.ts"] 
