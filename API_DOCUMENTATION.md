# 🌐 GymArt API Documentation

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Authentification](#authentification)
- [Endpoints](#endpoints)
- [Modèles de données](#modèles-de-données)
- [Codes d'erreur](#codes-derreur)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Environnements](#environnements)

## 🎯 Vue d'ensemble

L'API GymArt est une API RESTful construite avec Express.js et PostgreSQL. Elle fournit des endpoints pour la gestion de l'application de fitness GymArt.

**URL de base**: `http://localhost:3001`

**Version**: `1.0.0`

**Format de réponse**: JSON

## 🔐 Authentification

Actuellement, l'API ne nécessite pas d'authentification. Tous les endpoints sont publics pour cette version de développement.

## 📡 Endpoints

### 🏠 Root Endpoint

#### GET /

Retourne les informations générales de l'API.

**Réponse**:
```json
{
  "name": "GymArt API",
  "version": "1.0.0",
  "description": "Backend API for GymArt application",
  "endpoints": ["/api/test", "/api/health"]
}
```

**Codes de statut**:
- `200 OK`: Succès

---

### 🧪 Test Endpoint

#### GET /api/test

Endpoint de test pour vérifier que l'API fonctionne correctement.

**Réponse**:
```json
{
  "ok": true,
  "message": "API is working correctly!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "endpoint": "/api/test"
}
```

**Codes de statut**:
- `200 OK`: API fonctionnelle

---

### 💚 Health Check

#### GET /api/health

Vérifie l'état de santé de l'API et la connectivité à la base de données.

**Réponse (Succès)**:
```json
{
  "status": "ok",
  "message": "API connected to database!"
}
```

**Réponse (Erreur)**:
```json
{
  "status": "error",
  "message": "Database connection failed"
}
```

**Codes de statut**:
- `200 OK`: API et base de données fonctionnelles
- `500 Internal Server Error`: Problème de connexion à la base de données

**Tests effectués**:
- ✅ Connexion à PostgreSQL
- ✅ Exécution de `SELECT 1` pour validation

---

## 📊 Modèles de données

### HealthResponse

```typescript
interface HealthResponse {
  status: "ok" | "error";
  message: string;
}
```

### TestResponse

```typescript
interface TestResponse {
  ok: boolean;
  message: string;
  timestamp: string;
  endpoint: string;
}
```

### ApiInfo

```typescript
interface ApiInfo {
  name: string;
  version: string;
  description: string;
  endpoints: string[];
}
```

## ⚠️ Codes d'erreur

| Code | Description | Solution |
|------|-------------|----------|
| `200` | Succès | - |
| `404` | Endpoint non trouvé | Vérifier l'URL |
| `500` | Erreur serveur | Vérifier les logs, connectivité DB |

### Gestion des erreurs

En **développement**, les erreurs incluent la stack trace :
```json
{
  "error": "Database connection failed",
  "stack": "Error: connect ECONNREFUSED...",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

En **production**, les erreurs sont sécurisées :
```json
{
  "error": "Erreur interne du serveur",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔧 Exemples d'utilisation

### cURL

```bash
# Test de connectivité
curl http://localhost:3001/api/test

# Vérification de santé
curl http://localhost:3001/api/health

# Informations API
curl http://localhost:3001/
```

### JavaScript/Fetch

```javascript
// Health check
const checkHealth = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/health');
    const data = await response.json();
    
    if (data.status === 'ok') {
      console.log('✅ API is healthy');
    } else {
      console.log('❌ API has issues:', data.message);
    }
  } catch (error) {
    console.error('❌ Failed to reach API:', error);
  }
};
```

### Python/Requests

```python
import requests

# Test endpoint
response = requests.get('http://localhost:3001/api/test')
if response.status_code == 200:
    data = response.json()
    print(f"✅ API Test: {data['message']}")
```

## 🌍 Environnements

### Développement
- **URL**: `http://localhost:3001`
- **Base de données**: PostgreSQL local (port 5432)
- **Logs**: Détaillés avec stack traces

### Production
- **URL**: À définir selon déploiement
- **Base de données**: PostgreSQL distant
- **Logs**: Sécurisés sans stack traces

## 🔒 Sécurité

### Headers de sécurité (Helmet.js)

L'API inclut automatiquement les headers de sécurité suivants :

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Content-Security-Policy`: Politique stricte
- `Strict-Transport-Security`: HTTPS forcé

### CORS

- **Origines autorisées**: `http://localhost:3000` (développement)
- **Credentials**: Autorisés
- **Méthodes**: GET, POST, PUT, DELETE, OPTIONS

### Rate Limiting

- **Développement**: 1000 requêtes / 15 minutes
- **Production**: 100 requêtes / 15 minutes

## 📈 Monitoring

### Métriques disponibles

- Temps de réponse des endpoints
- Statut de la base de données
- Nombre de requêtes par endpoint

### Logs

```bash
# Voir les logs en temps réel
docker compose logs -f api

# Logs spécifiques à la santé
docker compose logs api | grep health
```

## 🚀 Évolutions futures

- [ ] Authentification JWT
- [ ] Endpoints CRUD pour utilisateurs
- [ ] Endpoints pour exercices et programmes
- [ ] Documentation Swagger/OpenAPI
- [ ] Versioning de l'API (v2, v3...)
- [ ] Pagination pour les listes
- [ ] Filtrage et tri des données

---

**📝 Note**: Cette documentation est maintenue automatiquement. Pour toute question, consultez le [README principal](./README.md) ou créez une issue.
