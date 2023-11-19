
FROM node:18-alpine AS development
ENV NODE_ENV development
# Add a work directory
WORKDIR /
# Cache and Install dependencies
COPY .env .
COPY package.json .
COPY package-lock.json .
COPY yarn.lock .
RUN npm install
# Copy app files
COPY . .
# Expose port
EXPOSE 3000
# Start the app
CMD [ "npm", "run", "start:dev" ]
