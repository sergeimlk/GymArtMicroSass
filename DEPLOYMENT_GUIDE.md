# 🚀 Guide de Déploiement GymArt - Production

Ce guide vous accompagne pour déployer votre projet GymArt en production avec :
- **Backend** sur Render (avec PostgreSQL managé)
- **Frontend** sur Vercel

## 📋 Prérequis

- Compte GitHub avec le repository GymArt
- Compte Render (gratuit) : https://render.com
- Compte Vercel (gratuit) : https://vercel.com

---

## 🗄️ ÉTAPE 1 : Déploiement Backend sur Render

### 1.1 Créer le service PostgreSQL

1. **Connectez-vous à Render** : https://dashboard.render.com
2. **Créer une nouvelle base de données** :
   - Cliquez sur "New +" → "PostgreSQL"
   - **Name** : `gymart-postgres`
   - **Database** : `gymart`
   - **User** : `postgres`
   - **Region** : `Frankfurt` (ou proche de vous)
   - **Plan** : Free (pour les tests)
3. **Notez les informations de connexion** (elles seront auto-configurées)

### 1.2 Déployer l'API Express

1. **Créer un nouveau Web Service** :
   - Cliquez sur "New +" → "Web Service"
   - **Connect Repository** : Sélectionnez votre repo GitHub GymArt
   - **Name** : `gymart-api`
   - **Region** : `Frankfurt`
   - **Branch** : `main` (ou `dev`)
   - **Root Directory** : `api`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`

2. **Variables d'environnement** :
   ```
   NODE_ENV=production
   PORT=10000
   ALLOWED_ORIGINS=https://gymart-client.vercel.app
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Connecter la base de données** :
   - Dans "Environment", ajoutez la database `gymart-postgres`
   - Render configurera automatiquement : `DATABASE_URL`, `DB_HOST`, `DB_PORT`, etc.

4. **Health Check** :
   - Health Check Path : `/api/health`

### 1.3 Vérifier le déploiement

Une fois déployé, votre API sera disponible à :
```
https://gymart-api.onrender.com
```

Testez :
```bash
curl https://gymart-api.onrender.com/api/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "message": "API connected to database!"
}
```

---

## 🌐 ÉTAPE 2 : Déploiement Frontend sur Vercel

### 2.1 Préparer le déploiement

1. **Connectez-vous à Vercel** : https://vercel.com/dashboard
2. **Importer le projet** :
   - Cliquez sur "New Project"
   - Importez depuis GitHub : votre repo GymArt
   - **Root Directory** : `client`
   - **Framework Preset** : Next.js

### 2.2 Configuration Vercel

1. **Variables d'environnement** :
   ```
   NEXT_PUBLIC_API_URL=https://gymart-api.onrender.com
   ```

2. **Build Settings** :
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`
   - **Install Command** : `npm install`

### 2.3 Déploiement

1. Cliquez sur "Deploy"
2. Vercel va :
   - Installer les dépendances
   - Builder l'application Next.js
   - Déployer sur le CDN global

Votre frontend sera disponible à :
```
https://gymart-client.vercel.app
```

---

## 🔗 ÉTAPE 3 : Configuration CORS Production

### 3.1 Mettre à jour les origines autorisées

Dans Render, mettez à jour la variable d'environnement :
```
ALLOWED_ORIGINS=https://gymart-client.vercel.app,https://votre-domaine-custom.com
```

### 3.2 Redéployer l'API

Render redéploiera automatiquement après la modification des variables d'environnement.

---

## ✅ ÉTAPE 4 : Tests de Validation Production

### 4.1 Test de l'API

```bash
# Test health check
curl https://gymart-api.onrender.com/api/health

# Test endpoint racine
curl https://gymart-api.onrender.com/

# Test endpoint test
curl https://gymart-api.onrender.com/api/test
```

### 4.2 Test du Frontend

1. Allez sur : https://gymart-client.vercel.app
2. Cliquez sur "Tester la connexion API"
3. Vérifiez que la réponse JSON s'affiche :
   ```json
   {
     "status": "ok",
     "message": "API connected to database!"
   }
   ```

### 4.3 Test d'intégration complète

1. **Frontend → API → Database** : ✅
2. **CORS configuré** : ✅
3. **HTTPS activé** : ✅
4. **Headers de sécurité** : ✅

---

## 🔧 ÉTAPE 5 : Optimisations Production

### 5.1 Domaine personnalisé (Optionnel)

**Vercel** :
- Ajoutez votre domaine dans les settings du projet
- Configurez les DNS selon les instructions Vercel

**Render** :
- Ajoutez un domaine custom dans les settings du service
- Mettez à jour `ALLOWED_ORIGINS`

### 5.2 Monitoring

**Render** :
- Logs disponibles dans le dashboard
- Métriques de performance
- Alertes par email

**Vercel** :
- Analytics intégrées
- Monitoring des performances
- Logs de déploiement

---

## 🚨 Dépannage

### Problème : API ne se connecte pas à la DB

**Solution** :
1. Vérifiez que la database PostgreSQL est bien connectée au service
2. Regardez les logs Render pour les erreurs de connexion
3. Vérifiez les variables d'environnement DB_*

### Problème : CORS bloque les requêtes

**Solution** :
1. Vérifiez `ALLOWED_ORIGINS` dans Render
2. Assurez-vous que l'URL Vercel est exacte (avec https://)
3. Redéployez après modification

### Problème : Frontend ne trouve pas l'API

**Solution** :
1. Vérifiez `NEXT_PUBLIC_API_URL` dans Vercel
2. Assurez-vous que l'URL Render est correcte
3. Redéployez le frontend

---

## 📊 URLs de Production

Après déploiement réussi :

- **Frontend** : https://gymart-client.vercel.app
- **API** : https://gymart-api.onrender.com
- **Health Check** : https://gymart-api.onrender.com/api/health
- **Database** : Managée par Render (PostgreSQL)

---

## 🎯 Validation des Critères du Brief

✅ **Docker Compose fonctionne** (développement)
✅ **API Health endpoint** fonctionnel en production
✅ **Frontend affiche la réponse DB** en production
✅ **HTTPS activé** sur les deux services
✅ **CORS configuré** pour la production
✅ **Sécurité** : Headers, Rate limiting, SSL
✅ **Monitoring** : Logs et métriques disponibles

**🏆 Projet déployé et fonctionnel en production !**
