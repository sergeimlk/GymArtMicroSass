# 🛡️ Guide de Sécurité GymArt - Issue #10

## 📋 Vue d'ensemble

Configuration complète de sécurité et durcissement pour l'application GymArt, respectant les recommandations de sécurité pour la mise en production.

## 🛡️ Mesures de sécurité implémentées

### **1. Headers de sécurité (Helmet)**

#### Configuration active
```javascript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['self'],
      styleSrc: ['self', 'unsafe-inline'],
      scriptSrc: ['self'],
      imgSrc: ['self', 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false, // Compatibilité développement
})
```

#### Headers automatiques
- **Content-Security-Policy** : Prévient les attaques XSS
- **Strict-Transport-Security** : Force HTTPS en production
- **X-Content-Type-Options** : Prévient le MIME sniffing
- **X-Frame-Options** : Protection contre le clickjacking
- **X-XSS-Protection** : Protection XSS native du navigateur
- **Referrer-Policy** : Contrôle des informations de référence

### **2. CORS strict et minimal**

#### Configuration sécurisée
```javascript
cors({
  origin: function(origin, callback) {
    // Vérification des origines autorisées
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par la politique CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})
```

#### Origines autorisées
- Configurées via `ALLOWED_ORIGINS` dans `.env`
- Par défaut : `http://localhost:3000,http://localhost:3001`
- Production : Domaines spécifiques uniquement

### **3. Rate Limiting**

#### Protection anti-DDoS
```javascript
rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: { error: 'Trop de requêtes, réessayez dans 15 minutes.' },
})
```

#### Limites par environnement
- **Développement** : 1000 requêtes/15min
- **Production** : 100 requêtes/15min
- Headers informatifs : `RateLimit-*`

### **4. Variables d'environnement sécurisées**

#### Variables sensibles
```env
# Secrets - À changer en production
POSTGRES_PASSWORD=changeme_in_production
JWT_SECRET=your_super_secret_jwt_key_change_in_production
API_KEY=your_api_key_for_external_services

# Sécurité
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### Bonnes pratiques
- ✅ Pas de secrets hardcodés dans le code
- ✅ Fichier `.env.example` avec valeurs par défaut
- ✅ `.env` dans `.gitignore`
- ✅ Variables documentées avec exemples

### **5. Gestion d'erreurs sécurisée**

#### Protection des informations sensibles
```javascript
// Production : Pas de détails d'erreur
if (process.env.NODE_ENV === 'production') {
  res.status(500).json({
    error: 'Erreur interne du serveur',
    timestamp: new Date().toISOString(),
  });
} else {
  // Développement : Détails pour debug
  res.status(500).json({
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });
}
```

### **6. Dockerfiles sécurisés**

#### Utilisateurs non-root
```dockerfile
# API
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001
USER nodeuser

# Client  
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs
```

#### Sécurité des images
- ✅ Images Alpine (surface d'attaque réduite)
- ✅ Utilisateurs non-root (UID 1001)
- ✅ Permissions appropriées avec `--chown`
- ✅ Multi-stage builds (pas de dépendances dev)

## 🧪 Tests et validation

### **1. Test des headers de sécurité**

```bash
# Vérifier tous les headers
curl -I http://localhost:3001/api/health

# Headers attendus
Content-Security-Policy: default-src 'self'...
Strict-Transport-Security: max-age=15552000...
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
RateLimit-Limit: 1000
```

### **2. Test du rate limiting**

```bash
# Tester la limite (attention en production!)
for i in {1..10}; do curl http://localhost:3001/api/health; done

# Vérifier les headers de limite
curl -I http://localhost:3001/api/health | grep RateLimit
```

### **3. Test CORS**

```bash
# Origine autorisée
curl -H "Origin: http://localhost:3000" http://localhost:3001/api/health

# Origine non autorisée (doit échouer)
curl -H "Origin: http://malicious-site.com" http://localhost:3001/api/health
```

### **4. Audit de sécurité npm**

```bash
# API
cd api && npm audit

# Client
cd client && npm audit

# Correction automatique (attention aux breaking changes)
npm audit fix
```

### **5. Vérification Docker**

```bash
# Vérifier l'utilisateur dans les conteneurs
docker-compose up -d
docker-compose exec api whoami  # Doit retourner 'nodeuser'
docker-compose exec client whoami  # Doit retourner 'nextjs'
```

## 🔒 Recommandations production

### **1. Variables d'environnement**

```env
# Production - Valeurs à personnaliser
NODE_ENV=production
POSTGRES_PASSWORD=super_secure_random_password_123!
JWT_SECRET=ultra_secure_jwt_secret_key_456!
ALLOWED_ORIGINS=https://yourdomain.com,https://api.yourdomain.com

# Rate limiting strict
RATE_LIMIT_MAX_REQUESTS=50
RATE_LIMIT_WINDOW_MS=900000
```

### **2. HTTPS obligatoire**

```javascript
// Forcer HTTPS en production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### **3. Monitoring et logs**

```javascript
// Logs de sécurité
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});
```

### **4. Sauvegarde et rotation des secrets**

- Rotation régulière des mots de passe
- Utilisation de gestionnaires de secrets (AWS Secrets Manager, etc.)
- Monitoring des tentatives d'accès non autorisées

## 🚨 Checklist sécurité

### **Avant déploiement**

- [ ] **Helmet activé** avec CSP configuré
- [ ] **CORS strict** avec origines spécifiques
- [ ] **Rate limiting** adapté à la charge
- [ ] **Variables sensibles** dans `.env` uniquement
- [ ] **Pas de secrets** dans le code source
- [ ] **Utilisateurs non-root** dans Docker
- [ ] **npm audit** sans vulnérabilités critiques
- [ ] **HTTPS** forcé en production
- [ ] **Logs sécurisés** sans données sensibles
- [ ] **Tests de pénétration** basiques effectués

### **Monitoring continu**

- [ ] **Alertes** sur tentatives d'accès non autorisées
- [ ] **Monitoring** des limites de taux
- [ ] **Audit régulier** des dépendances
- [ ] **Rotation** des secrets
- [ ] **Backup** des données critiques

## 🔍 Outils de sécurité recommandés

### **Analyse statique**
```bash
# ESLint security plugin
npm install --save-dev eslint-plugin-security

# Audit automatique
npm install --save-dev audit-ci
```

### **Tests de sécurité**
```bash
# OWASP ZAP pour tests de pénétration
# Snyk pour audit des vulnérabilités
# SonarQube pour analyse de code
```

## ✅ Critères d'acceptation validés

- ✅ **Headers sécurité actifs** : Helmet configuré avec CSP
- ✅ **CORS minimal** : Origines strictement contrôlées
- ✅ **Secrets via .env** : Aucun secret hardcodé
- ✅ **Images non-root** : Dockerfiles avec USER non-root
- ✅ **Rate limiting** : Protection anti-DDoS active
- ✅ **Gestion d'erreurs** : Pas d'exposition d'infos sensibles
- ✅ **Tests validés** : curl -I et npm audit OK
- ✅ **Documentation** : Guide complet de sécurité

## 🎯 Prochaines étapes

Après validation de l'Issue #10 :
- Issue #11 : CI/CD avec GitHub Actions et déploiement sécurisé
- Issue #12 : Documentation finale et validation complète
- Audit de sécurité externe recommandé avant production
