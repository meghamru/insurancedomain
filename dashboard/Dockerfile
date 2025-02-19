# Use Node.js image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install
RUN apt-get update
RUN apt-get install default-mysql-client -y

# Copy the rest of the code
COPY . .

# Expose the port
EXPOSE 3001

# Start the app
CMD ["node", "app.js"]
