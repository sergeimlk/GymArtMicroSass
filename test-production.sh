#!/bin/bash

# 🚀 Script de test de production GymArt
# Teste l'intégration complète Frontend ↔ API ↔ Database en production

set -e

echo "🏋️ ==============================================="
echo "🏋️ TEST DE PRODUCTION GYMART"
echo "🏋️ ==============================================="
echo ""

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# URLs de production (à modifier selon vos déploiements)
API_URL="https://gymart-api.onrender.com"
FRONTEND_URL="https://gymart-client.vercel.app"

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "✅ ${GREEN}$2${NC}"
    else
        echo -e "❌ ${RED}$2${NC}"
        return 1
    fi
}

# Fonction pour afficher les sections
print_section() {
    echo -e "\n${BLUE}🔍 $1${NC}"
    echo "----------------------------------------"
}

# Variables de contrôle
ERRORS=0

print_section "1. TEST DE L'API BACKEND (RENDER)"

# Test endpoint racine
echo "🧪 Test endpoint racine..."
if curl -s -f "$API_URL" > /dev/null; then
    print_result 0 "API racine accessible"
    
    # Vérifier la réponse JSON
    RESPONSE=$(curl -s "$API_URL")
    if echo "$RESPONSE" | grep -q "GymArt API"; then
        print_result 0 "Réponse API valide"
    else
        print_result 1 "Réponse API invalide"
        ERRORS=$((ERRORS + 1))
    fi
else
    print_result 1 "API racine inaccessible"
    ERRORS=$((ERRORS + 1))
fi

# Test endpoint health (CRITÈRE PRINCIPAL DU BRIEF)
echo "🏥 Test endpoint health..."
if curl -s -f "$API_URL/api/health" > /dev/null; then
    print_result 0 "Endpoint /api/health accessible"
    
    # Vérifier la connexion database
    HEALTH_RESPONSE=$(curl -s "$API_URL/api/health")
    if echo "$HEALTH_RESPONSE" | grep -q '"status":"ok"'; then
        print_result 0 "Database connectée (SELECT 1 réussi)"
        echo -e "   ${GREEN}Réponse: $HEALTH_RESPONSE${NC}"
    else
        print_result 1 "Database non connectée"
        echo -e "   ${RED}Réponse: $HEALTH_RESPONSE${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    print_result 1 "Endpoint /api/health inaccessible"
    ERRORS=$((ERRORS + 1))
fi

# Test endpoint test
echo "🔧 Test endpoint test..."
if curl -s -f "$API_URL/api/test" > /dev/null; then
    print_result 0 "Endpoint /api/test accessible"
else
    print_result 1 "Endpoint /api/test inaccessible"
    ERRORS=$((ERRORS + 1))
fi

print_section "2. TEST DU FRONTEND (VERCEL)"

# Test accessibilité frontend
echo "🌐 Test accessibilité frontend..."
if curl -s -f "$FRONTEND_URL" > /dev/null; then
    print_result 0 "Frontend accessible"
    
    # Vérifier le contenu HTML
    FRONTEND_CONTENT=$(curl -s "$FRONTEND_URL")
    if echo "$FRONTEND_CONTENT" | grep -q "GymArt"; then
        print_result 0 "Contenu frontend valide"
    else
        print_result 1 "Contenu frontend invalide"
        ERRORS=$((ERRORS + 1))
    fi
else
    print_result 1 "Frontend inaccessible"
    ERRORS=$((ERRORS + 1))
fi

print_section "3. TEST DES HEADERS DE SÉCURITÉ"

# Test headers de sécurité
echo "🛡️ Test headers de sécurité..."
SECURITY_HEADERS=$(curl -s -I "$API_URL/api/health")

if echo "$SECURITY_HEADERS" | grep -q "x-content-type-options"; then
    print_result 0 "Header X-Content-Type-Options présent"
else
    print_result 1 "Header X-Content-Type-Options manquant"
    ERRORS=$((ERRORS + 1))
fi

if echo "$SECURITY_HEADERS" | grep -q "x-frame-options"; then
    print_result 0 "Header X-Frame-Options présent"
else
    print_result 1 "Header X-Frame-Options manquant"
    ERRORS=$((ERRORS + 1))
fi

print_section "4. TEST CORS"

# Test CORS depuis le frontend
echo "🌐 Test CORS..."
CORS_RESPONSE=$(curl -s -H "Origin: $FRONTEND_URL" -I "$API_URL/api/health")

if echo "$CORS_RESPONSE" | grep -q "access-control-allow-origin"; then
    print_result 0 "CORS configuré"
else
    print_result 1 "CORS non configuré"
    ERRORS=$((ERRORS + 1))
fi

print_section "5. TEST DE PERFORMANCE"

# Test temps de réponse
echo "⚡ Test temps de réponse API..."
START_TIME=$(date +%s%N)
curl -s "$API_URL/api/health" > /dev/null
END_TIME=$(date +%s%N)
RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 )) # Convertir en ms

if [ $RESPONSE_TIME -lt 5000 ]; then
    print_result 0 "Temps de réponse acceptable (${RESPONSE_TIME}ms)"
else
    print_result 1 "Temps de réponse trop lent (${RESPONSE_TIME}ms)"
    ERRORS=$((ERRORS + 1))
fi

print_section "6. RÉSUMÉ FINAL"

echo ""
echo "🏋️ ==============================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "🎉 ${GREEN}DÉPLOIEMENT PRODUCTION VALIDÉ !${NC}"
    echo -e "✅ ${GREEN}Tous les critères du brief respectés${NC}"
    echo ""
    echo "📋 Critères validés en production:"
    echo "  ✅ API accessible via HTTPS"
    echo "  ✅ Endpoint /api/health fonctionnel"
    echo "  ✅ Database connectée (PostgreSQL)"
    echo "  ✅ Frontend accessible via HTTPS"
    echo "  ✅ CORS configuré pour l'intégration"
    echo "  ✅ Headers de sécurité présents"
    echo "  ✅ Performance acceptable"
    echo ""
    echo "🌐 URLs de production:"
    echo "   Frontend: $FRONTEND_URL"
    echo "   API: $API_URL"
    echo "   Health: $API_URL/api/health"
    echo ""
    echo "🧪 Test d'intégration complète:"
    echo "   1. Allez sur $FRONTEND_URL"
    echo "   2. Cliquez sur 'Tester la connexion API'"
    echo "   3. Vérifiez l'affichage du JSON de réponse"
else
    echo -e "❌ ${RED}$ERRORS ERREUR(S) EN PRODUCTION${NC}"
    echo -e "🔧 ${YELLOW}Corrigez les erreurs avant de valider${NC}"
    echo ""
    echo "📋 Vérifiez:"
    echo "  - Les URLs de déploiement sont correctes"
    echo "  - Les variables d'environnement sont configurées"
    echo "  - Les services sont bien démarrés"
    exit 1
fi

echo "🏋️ ==============================================="
