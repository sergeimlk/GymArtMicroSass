#!/bin/bash

# 🧪 Script de validation GymArt
# Vérifie que l'application est correctement configurée et fonctionnelle

echo "🧪 Validation de l'installation GymArt"
echo "======================================"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
check_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        return 1
    fi
}

# Fonction pour afficher les informations
info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Variables
ERRORS=0

echo ""
info "Vérification des prérequis..."

# Vérifier Docker
docker --version > /dev/null 2>&1
check_result $? "Docker installé" || ((ERRORS++))

# Vérifier Docker Compose
docker compose version > /dev/null 2>&1
check_result $? "Docker Compose disponible" || ((ERRORS++))

echo ""
info "Vérification de la configuration..."

# Vérifier la configuration Docker Compose
docker compose config > /dev/null 2>&1
check_result $? "Configuration Docker Compose valide" || ((ERRORS++))

# Vérifier les fichiers essentiels
[ -f ".env.example" ]
check_result $? "Fichier .env.example présent" || ((ERRORS++))

[ -f "compose.yml" ]
check_result $? "Fichier compose.yml présent" || ((ERRORS++))

[ -f "api/Dockerfile" ]
check_result $? "Dockerfile API présent" || ((ERRORS++))

[ -f "client/Dockerfile" ]
check_result $? "Dockerfile Client présent" || ((ERRORS++))

echo ""
info "Démarrage des services (peut prendre quelques minutes)..."

# Démarrer les services
docker compose up --build -d > /dev/null 2>&1
check_result $? "Services démarrés" || ((ERRORS++))

# Attendre que les services soient prêts
echo ""
info "Attente de la disponibilité des services..."
sleep 30

# Vérifier l'état des services
docker compose ps --format "table {{.Name}}\t{{.Status}}" | grep -q "Up"
check_result $? "Services en cours d'exécution" || ((ERRORS++))

echo ""
info "Test des endpoints..."

# Tester l'API Health
curl -s http://localhost:3001/api/health | grep -q '"status":"ok"'
check_result $? "API Health Check fonctionnel" || ((ERRORS++))

# Tester l'API Test
curl -s http://localhost:3001/api/test | grep -q '"ok":true'
check_result $? "API Test endpoint fonctionnel" || ((ERRORS++))

# Tester le frontend (vérifier qu'il répond)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"
check_result $? "Frontend accessible" || ((ERRORS++))

echo ""
info "Test de la base de données..."

# Tester la connexion PostgreSQL
docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1
check_result $? "PostgreSQL accessible" || ((ERRORS++))

echo ""
info "Vérification des logs..."

# Vérifier qu'il n'y a pas d'erreurs critiques dans les logs
docker compose logs api 2>&1 | grep -i "error" | grep -v "warn" | wc -l | grep -q "^0$"
check_result $? "Pas d'erreurs critiques dans les logs API" || ((ERRORS++))

echo ""
echo "======================================"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 Validation réussie ! L'application est prête.${NC}"
    echo ""
    echo "📍 URLs importantes:"
    echo "   • Frontend: http://localhost:3000"
    echo "   • API: http://localhost:3001"
    echo "   • Health Check: http://localhost:3001/api/health"
    echo ""
    echo "🔧 Commandes utiles:"
    echo "   • Voir les logs: docker compose logs -f"
    echo "   • Arrêter: docker compose down"
    echo "   • Nettoyer: docker compose down -v"
else
    echo -e "${RED}❌ Validation échouée avec $ERRORS erreur(s).${NC}"
    echo ""
    echo "🔧 Suggestions de dépannage:"
    echo "   • Vérifier les logs: docker compose logs"
    echo "   • Reconstruire: docker compose build --no-cache"
    echo "   • Nettoyer et redémarrer: docker compose down -v && docker compose up --build -d"
    exit 1
fi
