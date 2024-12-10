# Use Node.js base image
FROM node:20-bullseye

# Install R and necessary dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    r-base \
    libcurl4-openssl-dev \
    libssl-dev \
    libxml2-dev && \
    rm -rf /var/lib/apt/lists/* && \
    R --version && Rscript --version

# Set the working directory for the app
WORKDIR /usr/src/app

# Copy package.json and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Start the Node.js app, using $PORT if set
CMD ["node", "index.js"]
