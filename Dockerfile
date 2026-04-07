FROM node:22-slim

# No git inside container — skip husky git-hooks setup
ENV HUSKY=0

WORKDIR /app

# Layer caching: lockfile first, install, then copy source
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "test"]
