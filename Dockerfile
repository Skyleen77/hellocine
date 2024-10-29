# Use the official Node.js image
FROM node:20

# Enable Corepack to manage Yarn 4
RUN corepack enable && corepack prepare yarn@4.2.2 --activate

# Set the working directory
WORKDIR /frontend/app

# Copy all project files
COPY . .

# Install dependencies
RUN yarn install

# Expose the default Next.js port
EXPOSE 3000

# Start command
CMD ["yarn", "start"]
