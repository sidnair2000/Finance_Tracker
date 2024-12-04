# Use Node.js base image
FROM node:20-bullseye

# Install R and necessary dependencies
RUN apt-get update && apt-get install -y \
    r-base \
    && rm -rf /var/lib/apt/lists/*

# Verify installation of R and Rscript
RUN R --version && Rscript --version

# Set the working directory for the app
WORKDIR /usr/src/app

# Copy package.json and install Node.js dependencies
COPY package.json ./      
RUN npm install

# Copy the rest of the application files
COPY . .     

# Expose the port your app runs on (default for Node.js is 8080)
EXPOSE 8080

# Start the Node.js app
CMD ["node", "index.js"]
