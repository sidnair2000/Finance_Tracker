# Use a base image with Node.js 20
FROM node:20-bullseye

# Install R and any required libraries
RUN apt-get update && apt-get install -y \
    r-base \
    libcurl4-openssl-dev \
    libssl-dev \
    libxml2-dev \
    && rm -rf /var/lib/apt/lists/*  # Clean up apt cache to reduce image size

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files (including R scripts)
COPY . .

# Expose the port your app runs on (default for Node.js is 3000)
EXPOSE 8080

# Start the application
CMD ["node", "index.js"]
