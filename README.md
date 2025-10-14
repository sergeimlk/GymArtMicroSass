# 🏋️ GymArt App

[![CI/CD Pipeline](https://github.com/sergeimlk/GymArtMicroSass/actions/workflows/ci.yml/badge.svg)](https://github.com/sergeimlk/GymArtMicroSass/actions/workflows/ci.yml)
[![Quality Gate](https://img.shields.io/badge/Quality%20Gate-Passing-brightgreen)](https://github.com/sergeimlk/GymArtMicroSass)
[![Security](https://img.shields.io/badge/Security-Hardened-blue)](./SECURITY.md)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)](./DOCKER.md)

Infrastructure fullstack avec Express (API), Next.js (client), PostgreSQL (DB), Docker et GitHub Actions.

> **🚀 Pour un démarrage rapide (évaluateurs)**: Consultez le [Guide de Démarrage Rapide](./QUICKSTART.md)

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Commandes Docker Compose](#commandes-docker-compose)
- [Développement local](#développement-local)
- [Endpoints API](#endpoints-api)
- [Tests](#tests)
- [CI/CD](#cicd)
- [Architecture](#architecture)
- [Contribuer](#contribuer)
- [Dépannage](#dépannage)

## 🧰 Prérequis

- **Node.js** LTS (v18+)
- **Docker Desktop** avec Docker Compose
- **Git** pour le versioning
- **npm/pnpm/yarn** gestionnaire de paquets
- IDE recommandé: VS Code ou JetBrains

## 🚀 Installation

### ⚡ Démarrage rapide (Docker - Recommandé)

```bash
# 1. Cloner le repository
git clone https://github.com/sergeimlk/GymArtMicroSass.git
cd GymArtMicroSass

# 2. Configurer l'environnement
cp .env.example .env

# 3. Démarrer tous les services
docker compose up --build -d

# 4. Vérifier que tout fonctionne
curl http://localhost:3001/api/health
curl http://localhost:3000

# 5. Voir les logs (optionnel)
docker compose logs -f
```

**🎯 URLs après démarrage**:

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

### Installation rapide avec Docker (ancienne méthode)

### Installation locale pour développement

```bash
# Installer les dépendances workspace
npm install

# Installer les dépendances des sous-projets
cd api && npm install
cd ../client && npm install
cd ..

# Démarrer en mode développement
npm run dev
```

## 🔧 Variables d'environnement

Copiez `.env.example` vers `.env` et ajustez selon vos besoins:

| Variable              | Description            | Valeur par défaut       |
| --------------------- | ---------------------- | ----------------------- |
| `POSTGRES_HOST`       | Hôte PostgreSQL        | `postgres`              |
| `POSTGRES_PORT`       | Port PostgreSQL        | `5432`                  |
| `POSTGRES_USER`       | Utilisateur DB         | `postgres`              |
| `POSTGRES_PASSWORD`   | Mot de passe DB        | `postgres`              |
| `POSTGRES_DB`         | Nom de la base         | `gymart`                |
| `API_PORT`            | Port API Express       | `3001`                  |
| `FRONT_PORT`          | Port client Next.js    | `3000`                  |
| `NODE_ENV`            | Environnement          | `development`           |
| `NEXT_PUBLIC_API_URL` | URL API pour le client | `http://localhost:3001` |

## 🐳 Commandes Docker Compose

### Commandes de base

```bash
# Construire les images (première fois ou après modifications)
docker compose build

# Construire sans cache (si problèmes)
docker compose build --no-cache

# Démarrer les services en arrière-plan
docker compose up -d

# Démarrer avec rebuild automatique
docker compose up --build -d

# Voir les logs en temps réel
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f api
docker compose logs -f client
docker compose logs -f postgres
```

### Commandes de maintenance

```bash
# Arrêter les services (garde les volumes)
docker compose down

# Arrêter et supprimer les volumes (⚠️ perte de données)
docker compose down -v

# Redémarrer un service spécifique
docker compose restart api

# Vérifier l'état des services
docker compose ps

# Vérifier la configuration
docker compose config

# Nettoyer complètement (images, volumes, networks)
docker compose down -v --rmi all --remove-orphans
```

### Commandes de debug

```bash
# Entrer dans un conteneur
docker compose exec api bash
docker compose exec postgres psql -U postgres -d gymart

# Voir les ressources utilisées
docker compose top

# Inspecter un service
docker compose exec api env
```

## 💻 Développement local

### Démarrage des services

```bash
# Tous les services en parallèle
npm run dev

# Ou individuellement
npm run dev --workspace=api
npm run dev --workspace=client
```

### Scripts disponibles

```bash
# Linting et formatage
npm run lint          # Lint tous les projets
npm run lint:fix      # Fix automatique
npm run format        # Format avec Prettier

# Tests
npm run test          # Tests API

# Docker helpers
npm run docker:build  # Build images
npm run docker:up     # Start services
npm run docker:down   # Stop services
npm run docker:logs   # View logs
```

## 🌐 Endpoints API

### Endpoints principaux

| Méthode | Endpoint      | Description          | Réponse        |
| ------- | ------------- | -------------------- | -------------- |
| `GET`   | `/`           | Informations API     | `200` JSON     |
| `GET`   | `/api/test`   | Test de connectivité | `200` JSON     |
| `GET`   | `/api/health` | Santé + DB status    | `200/500` JSON |

### Exemples de réponses

**GET /api/health** (Succès)

```json
{
  "status": "ok",
  "message": "API connected to database!"
}
```

**GET /api/health** (Erreur)

```json
{
  "status": "error",
  "message": "Database connection failed"
}
```

**GET /api/test**

```json
{
  "ok": true,
  "message": "API is working correctly!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "endpoint": "/api/test"
}
```

**GET /** (Root)

```json
{
  "name": "GymArt API",
  "version": "1.0.0",
  "description": "Backend API for GymArt application",
  "endpoints": ["/api/test", "/api/health"]
}
```

## 🧪 Tests

### Tests API (Jest)

```bash
# Exécuter les tests API
npm run test --workspace=api

# Tests en mode watch
npm run test:watch --workspace=api

# Tests avec couverture
npm run test:coverage --workspace=api
```

### Tests E2E (Playwright)

```bash
# Installer Playwright (première fois)
cd client && npx playwright install

# Exécuter les tests E2E
npm run test:e2e --workspace=client

# Tests E2E en mode UI
npm run test:e2e:ui --workspace=client

# Tests sur navigateurs spécifiques
npm run test:e2e -- --project=chromium
```

### Tests d'intégration

**Tests API (16 tests)**:

- ✅ Endpoints de base (`/`, `/api/test`, `/api/health`)
- ✅ Connexion base de données PostgreSQL
- ✅ Headers de sécurité (Helmet.js)
- ✅ CORS et rate limiting
- ✅ Gestion d'erreurs et format JSON
- ✅ Performance sous charge

**Tests E2E (48 tests sur 3 navigateurs)**:

- ✅ Intégration frontend ↔ backend
- ✅ Interception des appels API
- ✅ Tests de bout en bout complets
- ✅ Compatibilité multi-navigateurs (Chrome, Firefox, Safari)

## 🔄 CI/CD

### Pipeline GitHub Actions (`ci.yml`)

Le pipeline CI/CD automatisé comprend **6 jobs séquentiels** dans `.github/workflows/ci.yml` :

#### **1. 🔧 backend-checks** (Toujours)
```yaml
- PostgreSQL service intégré pour tests
- Linting ESLint + Prettier
- Tests unitaires Jest + tests d'intégration
- Audit sécurité npm (niveau moderate)
- Validation connexion base de données
```

#### **2. 🎨 frontend-checks** (Toujours - Parallèle)
```yaml
- Linting ESLint + vérification TypeScript
- Build Next.js optimisé
- Audit sécurité npm (niveau moderate)
- Upload artifacts du build
```

#### **3. 🐳 docker-validation** (Après checks précédents)
```yaml
Dépendances: needs: [backend-checks, frontend-checks]
- Validation syntaxe Docker Compose
- Build des images Docker
- Démarrage stack complète
- Tests endpoints API (/health, /test, /)
- Tests accessibilité frontend
- Cleanup automatique
```

#### **4. 🔒 security-scan** (PR uniquement)
```yaml
Condition: if: github.event_name == 'pull_request'
- Scan vulnérabilités avec Trivy
- Rapport SARIF vers GitHub Security
- Upload toujours (même échec)
```

#### **5. ⚡ performance-test** (PR uniquement)
```yaml
Condition: if: github.event_name == 'pull_request'
- Installation Apache Bench
- Tests de charge: 100 req, 10 concurrentes
- Endpoints: /api/health et /api/test
- Cleanup automatique
```

#### **6. 🚀 deployment-ready** (Main uniquement)
```yaml
Condition: if: github.ref == 'refs/heads/main'
Dépendances: needs: [backend-checks, frontend-checks, docker-validation]
- Marquage déploiement prêt
- Rapport résumé GitHub Actions
```

### Déclenchement et Conditions

| Événement | Jobs Exécutés | Condition |
|-----------|----------------|-----------|
| **Push main/dev** | backend + frontend + docker + deploy | Automatique |
| **PR main/dev** | Tous les jobs | Automatique |
| **Security scan** | PR uniquement | `github.event_name == 'pull_request'` |
| **Perf tests** | PR uniquement | `github.event_name == 'pull_request'` |
| **Deploy ready** | Main uniquement | `github.ref == 'refs/heads/main'` |

### Métriques de Performance

- **Temps total estimé** : 15-20 minutes (30 min max)
- **Jobs parallèles** : `backend-checks` et `frontend-checks`
- **Cache optimisé** : node_modules réutilisées
- **Cleanup automatique** : Containers supprimés après tests

### Statut Requis

✅ **Tous les jobs doivent réussir** pour permettre le merge
🚫 **Échec d'un job** = merge bloqué automatiquement
👀 **Rapports détaillés** accessibles dans l'onglet "Actions"

### Badges de Statut

- [![CI/CD Pipeline](https://github.com/sergeimlk/GymArtMicroSass/actions/workflows/ci.yml/badge.svg)](https://github.com/sergeimlk/GymArtMicroSass/actions/workflows/ci.yml) - Statut du pipeline
- [![Quality Gate](https://img.shields.io/badge/Quality%20Gate-Passing-brightgreen)](https://github.com/sergeimlk/GymArtMicroSass) - Qualité du code
- [![Security](https://img.shields.io/badge/Security-Hardened-blue)](./SECURITY.md) - Sécurité renforcée

## 🏗️ Architecture

```
gymart-app/
├── api/                 # Express API
│   ├── src/
│   │   ├── index.js     # Serveur principal
│   │   ├── db.js        # Connexion PostgreSQL
│   │   └── *.test.js    # Tests
│   ├── Dockerfile       # Image API
│   └── package.json
├── client/              # Next.js Client
│   ├── src/app/
│   │   ├── layout.tsx   # Layout principal
│   │   ├── page.tsx     # Page d'accueil
│   │   └── globals.css  # Styles globaux
│   ├── Dockerfile       # Image Client
│   └── package.json
├── .github/workflows/   # CI/CD
├── .husky/             # Git hooks
├── compose.yml         # Orchestration Docker
├── .env.example        # Variables d'env
└── README.md
```

### Stack technique

- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: Next.js 14 + TypeScript + React 18
- **Database**: PostgreSQL 15 Alpine
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint + Prettier + Husky

## 🤝 Contribuer

### Workflow Git

1. **Branching**: `main` (protégée) ← `develop` ← `feature/issue-XXX`
2. **Commits**: Format [Conventional Commits](https://conventionalcommits.org/)
3. **PR**: Description + labels + milestone + checklist

### Format des commits

```bash
feat: add user authentication endpoint
fix: resolve database connection timeout
docs: update API documentation
test: add integration tests for health endpoint
chore: update dependencies
```

### Processus de contribution

```bash
# 1. Créer une branche feature
git checkout -b feature/issue-XXX-description

# 2. Développer avec commits conventionnels
git commit -m "feat: implement new feature"

# 3. Push et créer PR
git push origin feature/issue-XXX-description

# 4. Attendre validation CI + review
# 5. Merge après approbation
```

### Pre-commit hooks

Les hooks Husky vérifient automatiquement:

- ✅ Linting (ESLint)
- ✅ Formatage (Prettier)
- ✅ Messages de commit (commitlint)

## 🔒 Sécurité

### Mesures de sécurité implémentées

- ✅ **Helmet.js**: Headers de sécurité (CSP, X-Frame-Options, X-Content-Type-Options)
- ✅ **Rate Limiting**: 1000 req/15min (dev), 100 req/15min (prod)
- ✅ **CORS strict**: Origines configurables par environnement
- ✅ **Gestion d'erreurs sécurisée**: Pas de stack traces en production
- ✅ **Conteneurs non-root**: Utilisateurs dédiés (nodeuser:1001, nextjs:1001)
- ✅ **Variables d'environnement**: Pas de secrets hardcodés

### Audit de sécurité

```bash
# Audit des dépendances
npm audit
npm audit fix

# Scan de sécurité avec GitGuardian (si configuré)
git push # déclenche automatiquement le scan
```

## 🔧 Dépannage

### Problèmes courants

**🚫 Services ne démarrent pas**

```bash
# 1. Vérifier les logs pour identifier le problème
docker compose logs

# 2. Vérifier l'état des services
docker compose ps

# 3. Reconstruire les images sans cache
docker compose build --no-cache

# 4. Nettoyer complètement et redémarrer
docker compose down -v
docker compose up --build -d

# 5. Vérifier les ports disponibles
netstat -tulpn | grep -E ':(3000|3001|5432)'
```

**🗄️ Base de données inaccessible**

```bash
# 1. Vérifier le statut PostgreSQL
docker compose exec postgres pg_isready -U postgres

# 2. Voir les logs de la base de données
docker compose logs postgres

# 3. Tester la connexion via l'API
curl http://localhost:3001/api/health

# 4. Se connecter directement à PostgreSQL
docker compose exec postgres psql -U postgres -d gymart

# 5. Vérifier les variables d'environnement
docker compose exec api env | grep -E 'DB_|POSTGRES_'
```

**⚛️ Erreurs de build Next.js**

```bash
# 1. Nettoyer le cache Next.js
rm -rf client/.next client/node_modules

# 2. Réinstaller les dépendances
cd client && npm install

# 3. Tester le build localement
cd client && npm run build

# 4. Vérifier les variables d'environnement
cat client/.env.local
```

**🔧 Problèmes de performance**

```bash
# Voir l'utilisation des ressources
docker compose top

# Statistiques en temps réel
docker stats

# Nettoyer les images inutilisées
docker system prune -f
```

### Ports utilisés

- **3000**: Client Next.js
- **3001**: API Express
- **5432**: PostgreSQL

### Logs utiles

```bash
# Tous les services
docker compose logs -f

# Service spécifique
docker compose logs -f api
docker compose logs -f client
docker compose logs -f postgres
```

## 📚 Ressources

### Documentation du projet

- 📖 **[Documentation API complète](./API_DOCUMENTATION.md)** - Endpoints, exemples, codes d'erreur
- 🐳 **[Guide Docker](./DOCKER.md)** - Configuration et déploiement
- 🔒 **[Guide Sécurité](./SECURITY.md)** - Mesures de sécurité implémentées
- 🧹 **[Guide Linting](./LINTING.md)** - Configuration ESLint et Prettier

### Ressources externes

- [Documentation Next.js](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Conventional Commits](https://conventionalcommits.org/)
- [Playwright Testing](https://playwright.dev/)

---

**Développé avec ❤️ pour la formation CDA**
