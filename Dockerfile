# Stage 1: Build the SvelteKit app
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the SvelteKit app (this will generate a production-ready build)
RUN npm run build

# Stage 2: Serve the SvelteKit app
FROM node:18-slim

# Set the working directory
WORKDIR /app

COPY package*.json ./
# Install production dependencies only
RUN npm install --production

# Copy only necessary files from the build stage
COPY --from=build /app/build ./build
# Expose the port for Cloud Run (or local testing)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
