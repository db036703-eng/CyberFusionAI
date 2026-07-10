# Use Node.js 22 LTS release
FROM node:22-alpine

WORKDIR /frontend

# Copy dependencies
COPY package*.json ./
RUN npm install


# Copy source
COPY . .

EXPOSE 5173

# Start Vite dev server bound to 0.0.0.0 to allow container communication
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
