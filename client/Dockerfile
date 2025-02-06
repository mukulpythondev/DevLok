# Step 1: Use an official Node.js image
FROM node:22-alpine

# Step 2: Set the working directory
WORKDIR /app  

# Step 3: Copy package.json and package-lock.json first (for caching layers)
COPY package*.json ./  

# Step 4: Install dependencies
RUN npm install  

# Step 5: Copy the rest of the project files
COPY . .  

# Step 6: Expose Vite's development server port (default is 5173)
EXPOSE 5173  

# Step 7: Start the React app in development mode
CMD ["npm", "run", "dev"]
