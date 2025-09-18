**🎯 Plan Structuré selon le Brief :**

**Phase 1 : Fondations (Issues Lundi-Mardi)**
**• Issue #1** : Structure projet + Git
**• Issue #2** : Frontend Next.js basique
**• Issue #3** : Backend Express basique
**Phase 2 : Base de Données (Issues Mercredi)
• Issue #4** : PostgreSQL via Docker
**• Issue #5** : Connexion Express ↔ PostgreSQL
**• Issue #6** : **Endpoint GET /api/health** (objectif principal)
**Phase 3 : Intégration (Issues Mercredi)
• Issue #7** : **Frontend → API** (bouton Health)
**• Issue #8** : Dockerisation complète
**Phase 4 : Qualité (Issues Jeudi)
• Issue #9** : ESLint, Prettier, Git hooks
**• Issue #10** : Sécurité et durcissement
**• Issue #11** : Tests d'intégration / E2E
**Phase 5 : Finalisation (Issues Jeudi)
• Issue #12** : Documentation complète
**• Issue #13** : **CI/CD GitHub Actions** (3 jobs)
**• Issue #14** : Scripts Dev & Monitoring
**🏆 Caractéristiques du Plan :
• Respect exact du brief** Consignedubrief.md
**• Objectif health check** : API teste la BDD et retourne JSON au frontend
**• Stack imposée** : Docker + GitHub Actions + outils qualité
**• Critères de validation** intégrés pour chaque issue
**• Messages de commit** conventionnels prêts à utiliser

---

**#** **🚀 Plan de Commits API GymArt - 14 Issues Brief**

**##** **📋 **Vue d'ensemble du Brief\*\*\*\*

Ce plan détaille la mise en place technique d'un Micro-SaaS avec une \***\*infrastructure fullstack solide\*\*** :

- Base de données connectée à une API REST
- Frontend capable de communiquer avec l'API
- Outils de qualité de code (linting, formatage, sécurité)
- Pipeline CI/CD automatisée via GitHub Actions

\***\*Objectif principal\*\*** : Implémenter un \***\*health check\*\*** - endpoint qui teste la connexion BDD et retourne le statut au frontend.

**---**

**##** **📋 **ISSUE #1 — Initialiser la structure du projet et config Git\*\*\*\*

**###** \***\*🎯 Objectif :\*\***
Créer la structure de base du monorepo avec configuration Git appropriée.

**###** \***\*✅ Fichiers à Créer/Modifier :\*\***

```
/
├── api/                 # Backend API
│   ├── .dockerignore    # Exclusions Docker
│   └── src/             # Code source API
├── client/              # Frontend
│   ├── .dockerignore    # Exclusions Docker
│   └── src/             # Code source Frontend
├── .github/
│   └── workflows/       # GitHub Actions (vide pour l'instant)
├── .env.example         # Variables d'environnement template
├── .gitignore           # Exclusions Git globales
├── README.md            # Documentation projet
└── compose.yml          # Docker Compose (structure de base)
```

**###** \***\*🔧 Commandes :\*\***

```bash
*# Initialisation Git*
git init
git branch -M main

*# Structure des dossiers*
mkdir -p api/src client/src .github/workflows

*# Création des .dockerignore*
echo -e "node_modules/\n.git/\n.env\n*.log\ndist/\nbuild/\n.DS_Store" > api/.dockerignore
echo -e "node_modules/\n.git/\n.env\n*.log\ndist/\nbuild/\n.DS_Store" > client/.dockerignore
```

**###** \***\*💬 Message de Commit :\*\***

```
🏗️ feat: initialize project structure and Git configuration

- Create monorepo structure (api/, client/)
- Add .dockerignore files for both services
- Setup .env.example template
- Initialize Git repository with main branch
- Add basic README.md structure

Closes #1
```

**---**

**##** **📋 **ISSUE #2 — Frontend Next.js basique (local)\*\*\*\*

**###** \***\*🎯 Objectif :\*\***
Initialiser une application Next.js basique avec TypeScript et Tailwind CSS.

**###** \***\*✅ Fichiers à Créer/Modifier :\*\***

```
client/
├── package.json         # Dépendances Next.js
├── next.config.js       # Configuration Next.js
├── tailwind.config.js   # Configuration Tailwind
├── tsconfig.json        # Configuration TypeScript
├── postcss.config.js    # Configuration PostCSS
├── src/
│   ├── app/
│   │   ├── layout.tsx   # Layout principal
│   │   ├── page.tsx     # Page d'accueil
│   │   └── globals.css  # Styles globaux
│   └── components/
│       └── HealthCheck.tsx # Composant test API (vide)
└── public/
    └── favicon.ico
```

**###** \***\*🔧 Commandes :\*\***

```bash
cd client
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npm install
```

**###** \***\*💬 Message de Commit :\*\***

```
🌐 feat: setup basic Next.js frontend with TypeScript

- Initialize Next.js 14 with App Router
- Configure TypeScript and Tailwind CSS
- Add ESLint configuration
- Create basic layout and home page
- Setup component structure for HealthCheck

Closes #2
```

**---**

**##** **📋 **ISSUE #3 — Backend Express basique (local)\*\*\*\*

**###** \***\*🎯 Objectif :\*\***
Créer une API Express basique avec TypeScript et structure modulaire.

**###** \***\*✅ Fichiers à Créer/Modifier :\*\***

```
api/
├── package.json         # Dépendances Express
├── tsconfig.json        # Configuration TypeScript
├── nodemon.json         # Configuration Nodemon
├── src/
│   ├── index.ts         # Point d'entrée
│   ├── app.ts           # Configuration Express
│   ├── routes/
│   │   └── health.ts    # Routes health (vide)
│   ├── middleware/
│   │   ├── cors.ts      # Configuration CORS
│   │   └── logger.ts    # Middleware logging
│   ├── config/
│   │   └── database.ts  # Configuration BDD (vide)
│   └── types/
│       └── index.ts     # Types TypeScript
└── .env.example         # Variables d'environnement API
```

**###** \***\*🔧 Commandes :\*\***

```bash
cd api
npm init -y
npm install express cors helmet morgan dotenv
npm install -D @types/express @types/cors @types/morgan typescript nodemon ts-node
npx tsc --init
```

**###** \***\*💬 Message de Commit :\*\***

```
🔌 feat: setup basic Express backend with TypeScript

- Initialize Express server with TypeScript
- Configure CORS, helmet, and morgan middleware
- Setup modular route structure
- Add environment variables configuration
- Create basic project structure and types

Closes #3
```

**---**

**##** **📋 **ISSUE #4 — Base de données PostgreSQL via Docker\*\*\*\*

**###** \***\*🎯 Objectif :\*\***
Configurer PostgreSQL avec Docker et scripts d'initialisation.

**###** \***\*✅ Fichiers à Créer/Modifier :\*\***

```
/
├── compose.yml          # Configuration Docker Compose complète
├── .env.example         # Variables BDD ajoutées
└── database/
    ├── init/
    │   └── 01-init.sql  # Script d'initialisation
    └── data/            # Volume de données (gitignore)
```

**###** \***\*🔧 Commandes :\*\***

```bash
*# Création du dossier database*
mkdir -p database/init database/data

*# Ajout au .gitignore*
echo "database/data/" >> .gitignore

*# Test de la base*
docker compose up -d database
docker compose logs database
```

**###** \***\*💬 Message de Commit :\*\***

```
🗄️ feat: setup PostgreSQL database with Docker

- Add PostgreSQL service to Docker Compose
- Create database initialization scripts
- Configure environment variables for database
- Setup data volume and gitignore rules
- Add health check for database service

Closes #4
```

**---**

**##** **📋 **ISSUE #5 — Connecter Express à PostgreSQL\*\*\*\*

**###** \***\*🎯 Objectif :\*\***
Établir la connexion entre l'API Express et PostgreSQL avec pool de connexions.

**###** \***\*✅ Fichiers à Créer/Modifier :\*\***

```
api/src/
├── config/
│   ├── database.ts      # Configuration et pool PostgreSQL
│   └── env.ts           # Validation variables d'environnement
├── services/
│   └── database.service.ts # Service de connexion BDD
├── utils/
│   └── logger.ts        # Logger personnalisé
└── types/
    └── database.ts      # Types pour la BDD
```

**###** \***\*🔧 Commandes :\*\***

```bash
cd api
npm install pg
npm install -D @types/pg
```

**###** \***\*💬 Message de Commit :\*\***

```
🔗 feat: connect Express to PostgreSQL database

- Setup PostgreSQL connection pool
- Add database service layer
- Configure environment validation
- Implement connection health check
- Add proper error handling and logging

Closes #5
```

**---**

**##** **📋 **ISSUE #6 — Endpoint GET /api/health\*\*\*\*

**###** \***\*🎯 Objectif :\*\***
Implémenter l'endpoint de health check qui teste la connexion BDD.

**###** \***\*✅ Fichiers à Créer/Modifier :\*\***

```
api/src/
├── routes/
│   └── health.ts        # Route GET /api/health
├── controllers/
│   └── health.controller.ts # Logique health check
├── services/
│   └── health.service.ts    # Service de vérification santé
└── types/
    └── health.ts        # Types pour health check
```

**###** \***\*🔧 Commandes :\*\***

```bash
*# Test de l'endpoint*
curl http://localhost:3001/api/health

*# Test avec Docker*
docker compose up -d
curl http://localhost:3001/api/health
```

**###** \***\*💬 Message de Commit :\*\***

```
🏥 feat: implement GET /api/health endpoint

- Add health check route with database connection test
- Implement controller and service layers
- Return JSON status (ok/error) with appropriate messages
- Add proper error handling for database failures
- Test database connection with simple SELECT query

Closes #6
```

**---**

**##** **📋 **ISSUE #7 — Intégration Frontend → API (bouton Health)\*\*\*\*

**###** \***\*🎯 Objectif :\*\***
Créer l'interface frontend pour tester l'endpoint health de l'API.

**###** \***\*✅ Fichiers à Créer/Modifier :\*\***

```
client/src/
├── components/
│   ├── HealthCheck.tsx  # Composant principal
│   ├── ui/
│   │   ├── Button.tsx   # Composant bouton réutilisable
│   │   └── Card.tsx     # Composant card pour affichage
│   └── StatusDisplay.tsx # Affichage du statut API
├── hooks/
│   └── useHealthCheck.ts # Hook pour appel API
├── lib/
│   └── api.ts           # Client API
└── types/
    └── health.ts        # Types partagés
```

**###** \***\*🔧 Commandes :\*\***

```bash
cd client
npm install axios
*# ou*
npm install fetch (si préférence pour fetch natif)
```

**###** \***\*💬 Message de Commit :\*\***

```
🌐 feat: implement frontend health check integration

- Add HealthCheck component with test button
- Create API client for health endpoint calls
- Implement proper error handling and loading states
- Display JSON response from API in user-friendly format
- Add reusable UI components (Button, Card)

Closes #7
```

**---**

**##** **📋 **ISSUE #8 — Dockerisation complète (API, Frontend, Compose)\*\*\*\*

**###** \***\*🎯 Objectif :\*\***
Créer les Dockerfiles pour chaque service et optimiser Docker Compose.

**###** \***\*✅ Fichiers à Créer/Modifier :\*\***

```
api/
└── Dockerfile           # Multi-stage build pour API

client/
└── Dockerfile           # Multi-stage build pour Frontend

compose.yml              # Configuration complète 3 services
compose.dev.yml          # Override pour développement
.dockerignore            # Exclusions globales
```

**###** \***\*🔧 Commandes :\*\***

```bash
*# Build et test*
docker compose build
docker compose up -d
docker compose logs -f

*# Test complet*
curl http://localhost:3000  *# Frontend*
curl http://localhost:3001/api/health  *# API*
```

**###** \***\*💬 Message de Commit :\*\***

```
🐳 feat: complete Docker setup with multi-stage builds

- Add optimized Dockerfiles for API and Frontend
- Implement multi-stage builds for smaller images
- Configure non-root users for security
- Setup development and production compose files
- Add proper service dependencies and health checks

Closes #8
```

**---**

**##** **📋 **ISSUE #9 — ESLint, Prettier, Git hooks (Lefthook/Husky)\*\*\*\*

**###** \***\*🎯 Objectif :\*\***
Configurer les outils de qualité de code et hooks Git automatisés.

**###** \***\*✅ Fichiers à Créer/Modifier :\*\***

```
/
├── .eslintrc.json       # Configuration ESLint globale
├── .prettierrc          # Configuration Prettier
├── .prettierignore      # Exclusions Prettier
├── lefthook.yml         # Configuration hooks Git
└── package.json         # Scripts de qualité

api/
├── .eslintrc.json       # Configuration ESLint API
└── package.json         # Scripts API

client/
├── .eslintrc.json       # Configuration ESLint Frontend
├── .prettierrc          # Configuration Prettier Frontend
└── package.json         # Scripts Frontend
```

**###** \***\*🔧 Commandes :\*\***

```bash
*# Installation globale*
npm install -D eslint prettier lefthook
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin

*# Installation par service*
cd api && npm install -D eslint prettier
cd ../client && npm install -D eslint prettier

*# Activation des hooks*
npx lefthook install
```

**###** \***\*💬 Message de Commit :\*\***

```
🧹 feat: setup code quality tools and Git hooks

- Configure ESLint and Prettier for TypeScript
- Add Lefthook for automated Git hooks
- Setup pre-commit and pre-push validations
- Add npm scripts for linting and formatting
- Configure IDE integration and ignore files

Closes #9
```

**---**

**##** **📋 **ISSUE #10 — Sécurité et durcissement\*\*\*\*

**###** \***\*🎯 Objectif :\*\***
Implémenter les mesures de sécurité essentielles pour l'API et l'infrastructure.

**###** \***\*✅ Fichiers à Créer/Modifier :\*\***

```
api/src/
├── middleware/
│   ├── security.ts      # Middleware sécurité
│   ├── rateLimit.ts     # Rate limiting
│   └── validation.ts    # Validation des inputs
├── config/
│   └── security.ts      # Configuration sécurité
└── utils/
    └── sanitize.ts      # Nettoyage des données

/
├── .env.example         # Variables sécurisées
└── security/
    ├── .nvmrc           # Version Node.js
    └── audit.md         # Documentation sécurité
```

**###** \***\*🔧 Commandes :\*\***

```bash
cd api
npm install helmet express-rate-limit express-validator
npm audit
npm audit fix
```

**###** \***\*💬 Message de Commit :\*\***

```
🛡️ feat: implement security hardening and protection

- Add Helmet.js for security headers
- Implement rate limiting middleware
- Add input validation and sanitization
- Configure CORS properly for production
- Add security audit documentation and npm audit

Closes #10
```

**---**

**##** **📋 **ISSUE #11 — Tests d'intégration / E2E (complément)\*\*\*\*

**###** \***\*🎯 Objectif :\*\***
Ajouter des tests pour valider le fonctionnement de l'endpoint health et de l'intégration.

**###** \***\*✅ Fichiers à Créer/Modifier :\*\***

```
api/
├── tests/
│   ├── integration/
│   │   └── health.test.ts   # Tests intégration health
│   ├── setup/
│   │   └── testDb.ts        # Configuration BDD test
│   └── helpers/
│       └── request.ts       # Helpers pour tests
├── jest.config.js           # Configuration Jest
└── package.json             # Scripts de test

client/
├── __tests__/
│   ├── components/
│   │   └── HealthCheck.test.tsx # Tests composants
│   └── hooks/
│       └── useHealthCheck.test.ts # Tests hooks
├── jest.config.js           # Configuration Jest
└── package.json             # Scripts de test
```

**###** \***\*🔧 Commandes :\*\***

```bash
*# Installation API*
cd api
npm install -D jest @types/jest supertest @types/supertest ts-jest

*# Installation Frontend*
cd ../client
npm install -D jest @testing-library/react @testing-library/jest-dom

*# Exécution des tests*
npm test
```

**###** \***\*💬 Message de Commit :\*\***

```
🧪 feat: add integration and E2E tests

- Implement health endpoint integration tests
- Add React component testing with Testing Library
- Configure Jest for both API and Frontend
- Add test database setup and teardown
- Create test helpers and utilities

Closes #11
```

**---**

**##** **📋 **ISSUE #12 — Documentation (README + API)\*\*\*\*

**###** \***\*🎯 Objectif :\*\***
Créer une documentation complète pour l'installation, l'utilisation et l'API.

**###** \***\*✅ Fichiers à Créer/Modifier :\*\***

```
/
├── README.md            # Documentation principale
├── docs/
│   ├── installation.md  # Guide d'installation
│   ├── development.md   # Guide développement
│   ├── api.md           # Documentation API
│   └── deployment.md    # Guide déploiement
├── api/
│   └── README.md        # Documentation API spécifique
└── client/
    └── README.md        # Documentation Frontend
```

**###** \***\*🔧 Commandes :\*\***

```bash
*# Génération documentation API (optionnel)*
cd api
npm install -D swagger-jsdoc swagger-ui-express
```

**###** \***\*💬 Message de Commit :\*\***

```
📚 docs: add comprehensive project documentation

- Create detailed README with installation instructions
- Add API documentation with endpoint specifications
- Document development workflow and best practices
- Add deployment guide for Docker and production
- Include troubleshooting section and FAQ

Closes #12
```

**---**

**##** **📋 **ISSUE #13 — CI/CD GitHub Actions (3 jobs)\*\*\*\*

**###** \***\*🎯 Objectif :\*\***
Configurer la pipeline CI/CD complète avec 3 jobs (Backend, Frontend, Docker).

**###** \***\*✅ Fichiers à Créer/Modifier :\*\***

```
.github/
├── workflows/
│   ├── ci.yml           # Pipeline CI/CD principale
│   ├── security.yml     # Audit sécurité
│   └── deploy.yml       # Déploiement (optionnel)
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   └── feature_request.md
└── pull_request_template.md
```

**###** \***\*🔧 Commandes :\*\***

```bash
*# Test local des actions (optionnel)*
npm install -g @github/act
act pull_request
```

**###** \***\*💬 Message de Commit :\*\***

```
🚀 feat: implement CI/CD pipeline with GitHub Actions

- Add 3-job pipeline (Backend, Frontend, Docker)
- Configure automated testing and linting
- Add security audit and dependency checks
- Setup pull request validation
- Add GitHub templates for issues and PRs

Closes #13
```

**---**

**##** **📋 **ISSUE #14 — Scripts Dev & Monitoring (bonus utile)\*\*\*\*

**###** \***\*🎯 Objectif :\*\***
Ajouter des scripts utilitaires pour le développement et le monitoring basique.

**###** \***\*✅ Fichiers à Créer/Modifier :\*\***

```
scripts/
├── dev/
│   ├── setup.sh         # Script d'installation complète
│   ├── reset-db.sh      # Reset de la base de données
│   └── logs.sh          # Affichage des logs
├── monitoring/
│   ├── health-check.sh  # Script de monitoring
│   └── backup.sh        # Sauvegarde BDD
└── utils/
    ├── clean.sh         # Nettoyage Docker
    └── update.sh        # Mise à jour dépendances

package.json             # Scripts npm globaux
```

**###** \***\*🔧 Commandes :\*\***

```bash
*# Rendre les scripts exécutables*
chmod +x scripts/**/*.sh

*# Test des scripts*
./scripts/dev/setup.sh
./scripts/monitoring/health-check.sh
```

**###** \***\*💬 Message de Commit :\*\***

```
🧰 feat: add development and monitoring scripts

- Create setup script for easy project initialization
- Add database reset and backup utilities
- Implement health monitoring script
- Add Docker cleanup and maintenance scripts
- Configure npm scripts for common tasks

Closes #14
```

**---**

**##** **🎯 **Workflow de Développement Recommandé\*\*\*\*

**###** \***\*Ordre d'Exécution des Issues :\*\***

```bash
*# Phase 1: Structure de base (Issues 1-3)*
git checkout -b feature/issue-1-project-structure
git checkout -b feature/issue-2-frontend-nextjs
git checkout -b feature/issue-3-backend-express

*# Phase 2: Base de données (Issues 4-6)*
git checkout -b feature/issue-4-postgresql-docker
git checkout -b feature/issue-5-express-postgresql
git checkout -b feature/issue-6-health-endpoint

*# Phase 3: Intégration (Issues 7-8)*
git checkout -b feature/issue-7-frontend-integration
git checkout -b feature/issue-8-docker-complete

*# Phase 4: Qualité (Issues 9-11)*
git checkout -b feature/issue-9-code-quality
git checkout -b feature/issue-10-security
git checkout -b feature/issue-11-tests

*# Phase 5: Documentation et CI/CD (Issues 12-14)*
git checkout -b feature/issue-12-documentation
git checkout -b feature/issue-13-github-actions
git checkout -b feature/issue-14-dev-scripts
```

**###** \***\*Commandes de Test Essentielles :\*\***

```bash
*# Lancement complet*
docker compose up -d --build

*# Vérification des services*
curl http://localhost:3000          *# Frontend*
curl http://localhost:3001/api/health *# API Health*

*# Tests de qualité*
npm run lint
npm run format
npm run test

*# Nettoyage*
docker compose down -v
```

**###** \***\*Critères de Validation :\*\***

- ✅ \***\*Docker Compose\*\*** : Un seul comando suffit
- ✅ \***\*API Health\*\*** : Endpoint GET fonctionnel avec test BDD
- ✅ \***\*Frontend\*\*** : Affichage du message de la BDD (pas console.log)
- ✅ \***\*Qualité\*\*** : ESLint/Prettier sans erreurs
- ✅ \***\*Git Hooks\*\*** : Vérification automatique avant commit/push
- ✅ \***\*GitHub Actions\*\*** : CI/CD sur pull requests

**---**

**##** **🏆 **Résumé du Projet\*\*\*\*

**###** \***\*🎯 Objectifs Atteints :\*\***

- ✅ \***\*Infrastructure Fullstack\*\*** complète avec Docker
- ✅ \***\*API REST\*\*** avec endpoint health et connexion PostgreSQL
- ✅ \***\*Frontend Next.js\*\*** avec intégration API
- ✅ \***\*Outils de Qualité\*\*** (ESLint, Prettier, Git hooks)
- ✅ \***\*CI/CD Pipeline\*\*** avec GitHub Actions
- ✅ \***\*Sécurité\*\*** et bonnes pratiques
- ✅ \***\*Tests\*\*** d'intégration et E2E
- ✅ \***\*Documentation\*\*** complète

**###** \***\*🚀 Stack Technique :\*\***

- \***\*Backend\*\*** : Node.js, Express, TypeScript, PostgreSQL
- \***\*Frontend\*\*** : Next.js 14, React 18, TypeScript, Tailwind CSS
- \***\*DevOps\*\*** : Docker, Docker Compose, GitHub Actions
- \***\*Qualité\*\*** : ESLint, Prettier, Lefthook, Jest
- \***\*Sécurité\*\*** : Helmet, Rate Limiting, Input Validation
