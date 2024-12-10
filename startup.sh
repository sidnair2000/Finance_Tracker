#!/bin/bash

echo "Updating package lists..."
apt-get update

echo "Installing R and dependencies..."
apt-get install -y r-base libcurl4-openssl-dev libssl-dev libxml2-dev

echo "Installing R packages..."
Rscript -e "install.packages('tidyverse', repos='https://cloud.r-project.org')"
Rscript -e "install.packages('DBI', repos='https://cloud.r-project.org')"
Rscript -e "install.packages('RPostgres', repos='https://cloud.r-project.org')"
Rscript -e "install.packages('dotenv', repos='https://cloud.r-project.org')"

echo "Starting Node.js application..."
node index.js
