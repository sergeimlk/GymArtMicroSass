# Multi-stage build pour l'API Express
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Stage 2: Runtime
FROM node:18-alpine AS runtime

# Installer wget pour les healthchecks
RUN apk add --no-cache wget

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

WORKDIR /app

# Copier les dépendances depuis le stage deps
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=nodeuser:nodejs . .

# Exposer le port
EXPOSE 3001

# Passer à l'utilisateur non-root
USER nodeuser

# Commande de démarrage
CMD ["npm", "start"]
