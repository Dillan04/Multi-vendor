# Use a smaller base image (e.g., node:16-alpine)
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first (for efficient caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app will run on
EXPOSE 5004

# Start the app
CMD ["node", "app.js"]
