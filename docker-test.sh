#!/bin/bash

# Script de test pour la dockerisation complète - Issue #8
# Usage: ./docker-test.sh

echo "🐳 Test de la dockerisation complète GymArt"
echo "=========================================="

# Vérifier que Docker est démarré
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas démarré. Veuillez démarrer Docker Desktop."
    exit 1
fi

echo "✅ Docker est démarré"

# Nettoyer les conteneurs existants
echo "🧹 Nettoyage des conteneurs existants..."
docker compose down --remove-orphans

# Build et démarrage des services
echo "🏗️ Build et démarrage des services..."
docker compose up -d --build

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 30

# Vérifier les services
echo "🔍 Vérification des services..."

# PostgreSQL
if docker compose exec postgres pg_isready -U postgres -d gymart > /dev/null 2>&1; then
    echo "✅ PostgreSQL: OK"
else
    echo "❌ PostgreSQL: ERREUR"
fi

# API
if curl -f -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ API: OK"
    echo "📄 Réponse API:"
    curl -s http://localhost:3001/api/health | jq
else
    echo "❌ API: ERREUR"
fi

# Frontend
if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: ERREUR"
fi

echo ""
echo "🎯 Test terminé!"
echo "📱 Frontend: http://localhost:3000"
echo "🔗 API: http://localhost:3001"
echo "🗄️ PostgreSQL: localhost:5433"
echo ""
echo "Pour arrêter: docker compose down"
