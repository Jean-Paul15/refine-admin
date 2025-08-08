#!/usr/bin/env bash

# Script de build Docker pour Refine Admin
# Usage: ./docker-build.sh [production|development]

set -e

MODE=${1:-production}

echo "🐳 Build Docker pour le mode: $MODE"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Vérification des variables d'environnement
# Chargement automatique depuis .env.production si il existe
if [ -f ".env.production" ]; then
    log "Chargement des variables depuis .env.production..."
    export $(grep -v '^#' .env.production | xargs)
    log "✓ Variables chargées depuis .env.production"
fi

if [ -z "$VITE_SUPABASE_URL" ]; then
    warning "VITE_SUPABASE_URL n'est pas définie"
fi

if [ -z "$VITE_SUPABASE_ANNON_KEY" ]; then
    warning "VITE_SUPABASE_ANNON_KEY n'est pas définie"
fi

# Tag de l'image
TAG="refine-admin:$MODE"

log "Nettoyage des images existantes..."
docker rmi $TAG 2>/dev/null || true

log "Construction de l'image Docker..."
docker build \
    --build-arg VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
    --build-arg VITE_SUPABASE_ANNON_KEY="$VITE_SUPABASE_ANNON_KEY" \
    -t $TAG \
    .

if [ $? -eq 0 ]; then
    log "✅ Image construite avec succès: $TAG"
    
    # Affichage des informations sur l'image
    echo ""
    log "Informations sur l'image:"
    docker images $TAG --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}"
    
    echo ""
    log "Pour démarrer l'application:"
    echo "docker run -p 3000:3000 $TAG"
    
    echo ""
    log "Pour démarrer avec des variables d'environnement:"
    echo "docker run -p 3000:3000 -e VITE_SUPABASE_URL=\$VITE_SUPABASE_URL -e VITE_SUPABASE_ANNON_KEY=\$VITE_SUPABASE_ANNON_KEY $TAG"
    
else
    error "❌ Échec de la construction de l'image"
fi
