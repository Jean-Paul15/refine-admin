# ========================================
# Dockerfile ultra-simple pour Refine Admin
# ========================================

# Étape 1 : build
FROM node:18-alpine AS builder
WORKDIR /app

# Copie des fichiers de package
COPY package.json package-lock.json* ./

# Installation des dépendances
RUN npm install

# Copie des fichiers d'environnement
COPY .env.production ./

# Copie du code source
COPY . .

# Lecture des variables depuis .env.production pour le build
RUN export $(cat .env.production | xargs) && npm run build

# Étape 2 : serveur simple
FROM node:18-alpine AS runner
WORKDIR /app

# Installation de serve
RUN npm install -g serve

# Copie des fichiers buildés
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
