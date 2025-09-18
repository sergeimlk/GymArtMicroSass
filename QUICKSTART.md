# 🚀 Guide de Démarrage Rapide - GymArt

> **Pour évaluateurs et nouveaux développeurs** - Démarrage en 5 minutes

## ⚡ Démarrage Ultra-Rapide

### Prérequis
- Docker Desktop installé et démarré
- Git installé

### Étapes (5 minutes)

```bash
# 1. Cloner le projet
git clone https://github.com/sergeimlk/GymArtMicroSass.git
cd GymArtMicroSass

# 2. Démarrer l'application
docker compose up --build -d

# 3. Vérifier que tout fonctionne
curl http://localhost:3001/api/health
```

**🎯 URLs importantes**:
- **Application**: http://localhost:3000
- **API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## ✅ Validation rapide

### Script de validation automatique

```bash
# Validation complète automatisée (recommandé)
./validate-setup.sh
```

### 1. Vérifier les services

```bash
# Statut des conteneurs
docker compose ps

# Logs en temps réel
docker compose logs -f
```

### 2. Tester l'API

```bash
# Health check (doit retourner {"status":"ok"})
curl http://localhost:3001/api/health

# Test endpoint
curl http://localhost:3001/api/test

# Informations API
curl http://localhost:3001/
```

### 3. Tester le Frontend

- Ouvrir http://localhost:3000
- Cliquer sur "Tester la connexion API"
- Vérifier que la connexion fonctionne

## 🧪 Lancer les tests

```bash
# Tests API (16 tests)
docker compose exec api npm test

# Tests E2E (48 tests sur 3 navigateurs)
docker compose exec client npx playwright test
```

## 🔧 Commandes utiles

### Gestion des services

```bash
# Arrêter
docker compose down

# Redémarrer
docker compose restart

# Voir les logs
docker compose logs -f api
docker compose logs -f client
docker compose logs -f postgres

# Nettoyer complètement
docker compose down -v
```

### Debug

```bash
# Entrer dans un conteneur
docker compose exec api bash
docker compose exec postgres psql -U postgres -d gymart

# Vérifier la base de données
docker compose exec postgres pg_isready -U postgres
```

## 🚨 Résolution de problèmes

### Problème: Services ne démarrent pas

```bash
# Solution 1: Reconstruire
docker compose build --no-cache
docker compose up -d

# Solution 2: Nettoyer et redémarrer
docker compose down -v
docker compose up --build -d
```

### Problème: Port déjà utilisé

```bash
# Vérifier les ports
netstat -tulpn | grep -E ':(3000|3001|5432)'

# Arrêter les processus conflictuels ou modifier les ports dans .env
```

### Problème: Base de données inaccessible

```bash
# Vérifier PostgreSQL
docker compose logs postgres
docker compose exec postgres pg_isready -U postgres

# Tester via l'API
curl http://localhost:3001/api/health
```

## 📋 Checklist d'évaluation

- [ ] ✅ Services démarrent avec `docker compose up -d`
- [ ] ✅ Frontend accessible sur http://localhost:3000
- [ ] ✅ API accessible sur http://localhost:3001
- [ ] ✅ Health check retourne `{"status":"ok"}`
- [ ] ✅ Base de données PostgreSQL connectée
- [ ] ✅ Tests API passent (16/16)
- [ ] ✅ Tests E2E passent (48/48)
- [ ] ✅ Logs sans erreurs critiques
- [ ] ✅ Arrêt propre avec `docker compose down`

## 📖 Documentation complète

- **[README principal](./README.md)** - Documentation complète
- **[Documentation API](./API_DOCUMENTATION.md)** - Endpoints détaillés
- **[Guide Docker](./DOCKER.md)** - Configuration avancée
- **[Guide Sécurité](./SECURITY.md)** - Mesures de sécurité

---

**🎯 Objectif**: Projet auto-portant, prêt pour évaluation et production
