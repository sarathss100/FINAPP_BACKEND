FROM node:22-alpine 

WORKDIR /app

# Copy package files 
COPY package*.json ./

# Install all dependencies 
RUN npm install 

# Copy source code
COPY . .

# Expose port 
EXPOSE 5000 

# Start development server with hot reload 
CMD ["npm", "run", "start"  ]