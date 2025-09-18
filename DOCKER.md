# 🐳 Dockerisation GymArt - Issue #8

## 📋 Vue d'ensemble

Cette configuration Docker Compose lance l'environnement complet GymArt avec 3 services :
- **PostgreSQL** : Base de données
- **API** : Backend Express.js
- **Client** : Frontend Next.js

## 🚀 Démarrage rapide

```bash
# Démarrer tous les services
docker compose up -d --build

# Vérifier les services
docker compose ps

# Voir les logs
docker compose logs -f
```

## 🏗️ Architecture des Dockerfiles

### API (Express.js)
- **Multi-stage build** : deps → runtime
- **Utilisateur non-root** : `nodeuser` (UID 1001)
- **Port** : 3001
- **Healthcheck** : `GET /api/health`

### Client (Next.js)
- **Multi-stage build** : deps → builder → runtime
- **Build standalone** : optimisé pour la production
- **Utilisateur non-root** : `nextjs` (UID 1001)
- **Port** : 3000
- **Healthcheck** : `GET /`

### PostgreSQL
- **Image** : `postgres:15-alpine`
- **Port** : 5433 (externe) → 5432 (interne)
- **Healthcheck** : `pg_isready`
- **Init script** : `init-db.sql`

## 🔗 Dépendances et ordre de démarrage

```
PostgreSQL (healthy) → API (healthy) → Client
```

- L'API attend que PostgreSQL soit prêt
- Le Client attend que l'API soit prête
- Healthchecks automatiques avec retry

## 🌐 Accès aux services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Interface utilisateur |
| API | http://localhost:3001 | Backend REST API |
| PostgreSQL | localhost:5433 | Base de données |

## 🧪 Tests

### Test automatique
```bash
./docker-test.sh
```

### Tests manuels
```bash
# Test API
curl http://localhost:3001/api/health

# Test Frontend (dans le navigateur)
open http://localhost:3000
```

## 🛠️ Commandes utiles

```bash
# Démarrer en mode détaché
docker compose up -d

# Rebuild complet
docker compose up -d --build --force-recreate

# Voir les logs d'un service
docker compose logs -f api
docker compose logs -f client
docker compose logs -f postgres

# Arrêter tous les services
docker compose down

# Arrêter et supprimer les volumes
docker compose down -v

# Entrer dans un conteneur
docker compose exec api sh
docker compose exec client sh
docker compose exec postgres psql -U postgres -d gymart
```

## 🔧 Variables d'environnement

Créer un fichier `.env` :
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gymart
```

## 📊 Monitoring

### Healthchecks
```bash
# Voir le statut des healthchecks
docker compose ps

# Détails d'un service
docker inspect saasbackapi-api-1 | jq '.[0].State.Health'
```

### Ressources
```bash
# Utilisation des ressources
docker stats

# Espace disque
docker system df
```

## 🚨 Dépannage

### Problèmes courants

**Port déjà utilisé**
```bash
# Vérifier les ports
lsof -i :3000
lsof -i :3001
lsof -i :5433

# Arrêter les processus
docker compose down
```

**Build échoue**
```bash
# Nettoyer le cache Docker
docker system prune -a

# Rebuild sans cache
docker compose build --no-cache
```

**Base de données corrompue**
```bash
# Supprimer le volume PostgreSQL
docker compose down -v
docker volume rm saasbackapi_postgres_data
```

## ✅ Critères d'acceptation validés

- ✅ **Multi-stage builds** : API et Client optimisés
- ✅ **Utilisateurs non-root** : Sécurité renforcée
- ✅ **.dockerignore optimisés** : Builds rapides
- ✅ **docker compose up -d --build** : Démarrage en une commande
- ✅ **3 services avec dépendances** : PostgreSQL → API → Client
- ✅ **Healthchecks** : Monitoring automatique
- ✅ **Tests fonctionnels** : `/api/health` et UI accessibles

## 🎯 Prochaines étapes

Après validation de l'Issue #8 :
- Issue #9 : Tests unitaires et d'intégration
- Issue #10 : CI/CD avec GitHub Actions
- Issue #11 : Documentation complète
- Issue #12 : Validation finale
