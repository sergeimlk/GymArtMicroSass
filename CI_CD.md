# 🚀 CI/CD Pipeline Documentation

## Vue d'ensemble

Le pipeline CI/CD de GymArt utilise GitHub Actions pour automatiser la validation de la qualité du code, les tests et le déploiement. Il garantit qu'aucun code défaillant n'atteint la production.

## 📋 Structure du Pipeline

### Workflow Principal : `.github/workflows/ci.yml`

```yaml
Déclencheurs:
  - Push sur main/dev
  - Pull Requests vers main/dev

Jobs:
  1. backend-checks     (Toujours)
  2. frontend-checks    (Toujours) 
  3. docker-validation  (Toujours)
  4. security-scan      (PR uniquement)
  5. performance-test   (PR uniquement)
  6. deployment-ready   (main uniquement)
```

## 🔧 Jobs Détaillés

### 1. Backend Quality Checks

**Durée estimée**: ~3-5 minutes

```bash
Services:
  - PostgreSQL 15 (pour tests d'intégration)

Étapes:
  ✅ Checkout code
  ✅ Setup Node.js 18 + cache npm
  ✅ Install dependencies (api/)
  ✅ Lint backend code (ESLint)
  ✅ Check formatting (Prettier)
  ✅ Security audit (npm audit)
  ✅ Run unit tests (Jest)
  ✅ Run integration tests (Jest + PostgreSQL)
```

**Variables d'environnement**:
- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_USER=postgres`
- `DB_PASSWORD=postgres`
- `DB_NAME=gymart`

### 2. Frontend Quality Checks

**Durée estimée**: ~4-6 minutes

```bash
Étapes:
  ✅ Checkout code
  ✅ Setup Node.js 18 + cache npm
  ✅ Install dependencies (client/)
  ✅ Lint frontend code (ESLint + Next.js)
  ✅ TypeScript type checking
  ✅ Check formatting (Prettier)
  ✅ Security audit (npm audit)
  ✅ Build frontend (Next.js)
  ✅ Upload build artifacts
```

**Variables d'environnement**:
- `NEXT_PUBLIC_API_URL=http://localhost:3001`

### 3. Docker Integration Tests

**Durée estimée**: ~5-8 minutes

```bash
Prérequis:
  - backend-checks ✅
  - frontend-checks ✅

Étapes:
  ✅ Checkout code
  ✅ Setup Docker Buildx
  ✅ Validate Docker Compose config
  ✅ Build Docker images
  ✅ Start services (compose up)
  ✅ Wait for health checks (120s timeout)
  ✅ Test API endpoints (/health, /test, /)
  ✅ Test frontend accessibility
  ✅ Show logs on failure
  ✅ Cleanup (compose down)
```

**Tests effectués**:
- `curl http://localhost:3001/api/health` → `{"status":"ok"}`
- `curl http://localhost:3001/api/test` → `{"ok":true}`
- `curl http://localhost:3001/` → `{"name":"GymArt API"}`
- `curl http://localhost:3000` → HTTP 200

### 4. Security Scanning (PR uniquement)

**Durée estimée**: ~2-3 minutes

```bash
Étapes:
  ✅ Checkout code
  ✅ Run Trivy vulnerability scanner
  ✅ Generate SARIF report
  ✅ Upload to GitHub Security tab
```

### 5. Performance Tests (PR uniquement)

**Durée estimée**: ~3-4 minutes

```bash
Étapes:
  ✅ Start Docker services
  ✅ Install Apache Bench (ab)
  ✅ Load test /api/health (100 req, 10 concurrent)
  ✅ Load test /api/test (100 req, 10 concurrent)
  ✅ Cleanup services
```

### 6. Deployment Ready (main uniquement)

**Durée estimée**: ~30 secondes

```bash
Prérequis:
  - backend-checks ✅
  - frontend-checks ✅
  - docker-validation ✅

Étapes:
  ✅ Mark as deployment ready
  ✅ Create deployment summary
  ✅ Generate GitHub summary
```

## 🚦 Statuts et Badges

### Badges dans README

```markdown
[![CI/CD Pipeline](https://github.com/sergeimlk/GymArtMicroSass/actions/workflows/ci.yml/badge.svg)](https://github.com/sergeimlk/GymArtMicroSass/actions/workflows/ci.yml)
[![Quality Gate](https://img.shields.io/badge/Quality%20Gate-Passing-brightgreen)](https://github.com/sergeimlk/GymArtMicroSass)
[![Security](https://img.shields.io/badge/Security-Hardened-blue)](./SECURITY.md)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)](./DOCKER.md)
```

### Interprétation des Statuts

| Badge | Signification |
|-------|---------------|
| 🟢 **Passing** | Tous les tests passent, code prêt |
| 🟡 **Pending** | Pipeline en cours d'exécution |
| 🔴 **Failing** | Au moins un job a échoué |
| ⚪ **No status** | Pas encore exécuté |

## 🔧 Maintenance et Debugging

### Commandes Locales pour Reproduire

```bash
# Backend checks
cd api
npm ci
npm run lint
npm run test
npm audit

# Frontend checks  
cd client
npm ci
npm run lint
npm run type-check
npm run build
npm audit

# Docker validation
docker compose config
docker compose build
docker compose up -d
curl http://localhost:3001/api/health
docker compose down -v
```

### Logs et Debugging

**Accéder aux logs GitHub Actions**:
1. Aller sur l'onglet "Actions" du repository
2. Cliquer sur le workflow échoué
3. Cliquer sur le job échoué
4. Développer l'étape qui a échoué

**Logs Docker en cas d'échec**:
```bash
# Le pipeline affiche automatiquement les logs
echo "=== API Logs ==="
docker compose logs api
echo "=== Client Logs ==="  
docker compose logs client
echo "=== PostgreSQL Logs ==="
docker compose logs postgres
```

## 📊 Métriques et Performance

### Temps d'exécution typiques

| Job | Durée Moyenne | Durée Max |
|-----|---------------|-----------|
| Backend Checks | 3-5 min | 8 min |
| Frontend Checks | 4-6 min | 10 min |
| Docker Validation | 5-8 min | 12 min |
| Security Scan | 2-3 min | 5 min |
| Performance Test | 3-4 min | 6 min |
| **Total Pipeline** | **15-20 min** | **30 min** |

### Optimisations Implémentées

- ✅ **Cache npm** : Réutilisation des node_modules
- ✅ **Parallélisation** : Jobs backend/frontend en parallèle
- ✅ **Artifacts** : Réutilisation du build frontend
- ✅ **Conditions** : Security/performance sur PR uniquement
- ✅ **Timeouts** : Évite les blocages infinis

## 🚨 Résolution de Problèmes

### Erreurs Communes

**1. Tests d'intégration échouent**
```bash
Cause: PostgreSQL pas prêt
Solution: Augmenter health-interval dans services
```

**2. Build frontend échoue**
```bash
Cause: Variables d'environnement manquantes
Solution: Vérifier NEXT_PUBLIC_API_URL
```

**3. Docker validation timeout**
```bash
Cause: Services lents à démarrer
Solution: Augmenter timeout de 120s à 180s
```

**4. Security scan bloqué**
```bash
Cause: Nouvelles vulnérabilités détectées
Solution: npm audit fix + commit
```

### Contact et Support

- **Issues GitHub** : [Créer une issue](https://github.com/sergeimlk/GymArtMicroSass/issues)
- **Documentation** : [README principal](./README.md)
- **Sécurité** : [Guide sécurité](./SECURITY.md)

---

**Dernière mise à jour** : Issue #13 - CI/CD GitHub Actions
