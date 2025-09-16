# 🏋️ GymArt App

Infrastructure fullstack avec Express (API), Next.js (client), PostgreSQL (DB), Docker et GitHub Actions.

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

### Installation rapide avec Docker

```bash
# Cloner le repository
git clone https://github.com/sergeimlk/GymArtMicroSass.git
cd gymart-app

# Configurer l'environnement
cp .env.example .env

# Démarrer tous les services
docker compose up --build -d

# Vérifier le statut
curl http://localhost:3001/api/health
```

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

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `POSTGRES_HOST` | Hôte PostgreSQL | `postgres` |
| `POSTGRES_PORT` | Port PostgreSQL | `5432` |
| `POSTGRES_USER` | Utilisateur DB | `postgres` |
| `POSTGRES_PASSWORD` | Mot de passe DB | `postgres` |
| `POSTGRES_DB` | Nom de la base | `gymart` |
| `API_PORT` | Port API Express | `3001` |
| `FRONT_PORT` | Port client Next.js | `3000` |
| `NODE_ENV` | Environnement | `development` |
| `NEXT_PUBLIC_API_URL` | URL API pour le client | `http://localhost:3001` |

## 🐳 Commandes Docker Compose

```bash
# Construire les images
docker compose build

# Démarrer les services
docker compose up -d

# Voir les logs
docker compose logs -f

# Arrêter les services
docker compose down

# Nettoyer (avec volumes)
docker compose down -v

# Vérifier la configuration
docker compose config
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

| Méthode | Endpoint | Description | Réponse |
|---------|----------|-------------|---------|
| `GET` | `/` | Informations API | `200` JSON |
| `GET` | `/api/test` | Test de connectivité | `200` JSON |
| `GET` | `/api/health` | Santé + DB status | `200/500` JSON |

### Exemples de réponses

**GET /api/health**
```json
{
  "status": "ok",
  "message": "Service is healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": {
    "connected": true,
    "message": "Database connection successful",
    "details": {
      "host": "postgres",
      "port": 5432,
      "database": "gymart"
    }
  }
}
```

## 🧪 Tests

### Tests API

```bash
# Exécuter les tests
npm run test --workspace=api

# Tests en mode watch
npm run test:watch --workspace=api
```

### Tests d'intégration

Les tests vérifient:
- ✅ Endpoints de base (`/`, `/api/test`)
- ✅ Health check avec DB
- ✅ Gestion d'erreurs 404
- ✅ Format des réponses JSON

## 🔄 CI/CD

### GitHub Actions

Le pipeline CI/CD comprend 3 jobs:

1. **Backend**: Lint + Tests API avec PostgreSQL
2. **Frontend**: Lint + Build Next.js
3. **Compose**: Validation end-to-end avec Docker

### Déclenchement

- Push sur `main` ou `develop`
- Pull Requests vers `main` ou `develop`

### Statut requis

Tous les jobs doivent passer pour permettre le merge.

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

## 🔧 Dépannage

### Problèmes courants

**Services ne démarrent pas**
```bash
# Vérifier les logs
docker compose logs

# Reconstruire les images
docker compose build --no-cache

# Nettoyer et redémarrer
docker compose down -v
docker compose up --build -d
```

**Base de données inaccessible**
```bash
# Vérifier le statut PostgreSQL
docker compose exec postgres pg_isready -U postgres

# Voir les logs DB
docker compose logs postgres

# Tester la connexion
curl http://localhost:3001/api/health
```

**Erreurs de build Next.js**
```bash
# Nettoyer le cache
rm -rf client/.next client/node_modules
cd client && npm install && npm run build
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

- [Documentation Next.js](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Conventional Commits](https://conventionalcommits.org/)

---

**Développé avec ❤️ pour la formation CDA**
