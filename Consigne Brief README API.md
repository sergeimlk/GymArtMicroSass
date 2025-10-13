# Brief microsaas -  Implémentation technique



<div align="center">
    <img src="./img/app-no-bg.svg" alt="app svg without bg" />
</div>

## Contexte du projet

Suite à la validation de votre concept et de votre design lors de la phase 1, ce brief vous guidera dans la **mise en place technique** de votre Micro-SaaS. Vous allez maintenant **initialiser l'architecture fullstack** et configurer l'environnement de développement, intégrant une base de données, une API et un frontend, le tout avec les **bonnes pratiques DevOps**.


Avant de développer les fonctionnalités métier, vous devez créer une infrastructure technique solide avec :
1. **Une base de données** connectée à une API REST
2. **Un frontend** capable de communiquer avec l'API
3. **Des outils de qualité** de code (linting, formatage, sécurité)
4. **Une pipeline CI/CD** automatisée via GitHub Actions

Cette mise en place technique servira de **fondation robuste** pour le développement futur de votre Micro-SaaS. Pour valider que tout fonctionne, vous implémenterez un **health check** - un endpoint qui teste la connexion à la base de données et retourne le statut de l'infrastructure au frontend.

## Modalités pédagogiques

**Durée : 5 jours**  
**Activité individuelle**  
**Tests entre pairs : binômes ou trinômes**


### Les étapes

#### 1. **Création du dépôt et structure du projet**

Initialisez un dépôt Git avec la structure suivante :

```
hello-api/
├── api/                 # Backend API
│   ├── Dockerfile       # Dockerfile du backend
│   ├── .dockerignore    # Fichiers à exclure
│   └── src/             # Code source
├── client/              # Frontend
│   ├── Dockerfile       # Dockerfile du frontend
│   ├── .dockerignore    # Fichiers à exclure
│   └── src/             # Code source
├── .github/
│   └── workflows/       # GitHub Actions
├── compose.yml          # Docker Compose
├── .env.example         # Variables d'environnement
└── README.md
```

#### 2. **Mise en place de Docker**

##### Structure recommandée

**Bonnes pratiques 2025 :**
- Dockerfile dans chaque dossier de service (api/, client/)
- Utilisation de `.dockerignore` pour optimiser le build
- Variables d'environnement dans `.env` (jamais dans le code)
- Multi-stage builds pour réduire la taille des images

##### Fichier `compose.yml`

La configuration Docker Compose doit :
- Définir les 3 services (database, backend, frontend)
- Configurer les dépendances entre services
- Mapper les ports nécessaires
- Monter les volumes pour le développement
- Utiliser des variables d'environnement

##### Fichier `.dockerignore`

Pour chaque service, créez un `.dockerignore` :
```
node_modules/
.git/
.env
*.log
dist/
build/
.DS_Store
```

#### 3. **Test de connexion à la base de données**

L'API devra exécuter une requête simple pour vérifier la connexion :

```sql
-- Exemples selon votre SGBD
SELECT 1 as test;              -- Standard SQL
SELECT version();              -- PostgreSQL/MySQL
SELECT sqlite_version();      -- SQLite
SELECT @@version;             -- SQL Server
```

Cette requête ne récupère pas de données stockées, elle vérifie simplement que la connexion à la base de données est établie.

#### 4. **Backend API**

Structure minimale dans `api/` :

- **Un endpoint de test** : `GET /api/health`
- **Test de connexion** à BDD (exécution d'un SELECT simple)
- **Retour JSON** selon l'état de la connexion :
  - Succès : `{ "status": "ok", "message": "API connected to database!" }`
  - Échec : `{ "status": "error", "message": "Database connection failed" }`



#### 5. **Frontend**

Fonctionnalités à implémenter :

1. **Bouton de test** : "Tester la connexion API"

2. **Appel API** :
   - Requête HTTP GET vers `/api/health`
   - Gestion des cas de succès et d'erreur
   - Affichage du JSON retourné par l'API

**Exemple de retour attendu :**
```json
// Succès
{
  "status": "ok", 
  "message": "API connected to database!"
}

// Erreur
{
  "status": "error", 
  "message": "Database connection failed"
}
```

#### 6. **Configuration Docker**

##### Dockerfile best practices

- **Multi-stage builds** : Séparer build et runtime
- **Non-root user** : Ne jamais exécuter en tant que root

##### Exemple de structure Dockerfile

```dockerfile
# Stage 1: Build
FROM [image-build] AS builder
WORKDIR /build
COPY [dependencies-file] .
RUN [install-dependencies]
COPY . .
RUN [build-command]

# Stage 2: Runtime
FROM [image-runtime]
WORKDIR /app
COPY --from=builder [built-files] .
USER nonroot
EXPOSE [port]
CMD ["start-command"]
```

#### 7. **Outils de qualité de code**

##### Configuration des outils de qualité

Selon votre stack technique, configurez les outils appropriés :

**Pour JavaScript/TypeScript :**
- ESLint pour le linting
- Prettier pour le formatage

**Pour PHP :**
- PHP_CodeSniffer ou PHPStan
- PHP-CS-Fixer pour le formatage

**Pour Java :**
- Checkstyle ou SonarLint
- Google Java Format

**Pour Python :**
- Flake8 ou Pylint
- Black pour le formatage

##### Pre-commit hooks

Mettez en place des hooks Git pour automatiser les vérifications grâce à `Husky`ou `Lefthook`

Ces outils permettront de vérifier automatiquement le code avant chaque commit et chaque push.

#### 8. **GitHub Actions**

Créez un workflow CI/CD dans `.github/workflows/ci.yml` qui doit :

##### Déclencheurs
- Pull requests vers `main` et `dev`
- Push sur la branche principale

##### Jobs à configurer

**1. Backend checks :**
- Installation des dépendances
- Exécution du linter
- Vérification du formatage
- Audit de sécurité des dépendances
- Tests unitaires (si présents)

**2. Frontend checks :**
- Installation des dépendances  
- Exécution du linter
- Vérification du formatage
- Build de l'application
- Tests unitaires (si présents)

**3. Docker validation :**
- Validation de la syntaxe des Dockerfiles
- Test de construction des images (optionnel)

##### Stratégies selon le langage

**JavaScript/TypeScript :** Node.js actions, cache npm/yarn
**PHP :** Setup PHP action, Composer cache  
**Java :** Setup Java action, Maven/Gradle cache
**Python :** Setup Python action, pip cache

Le workflow doit **échouer** si une étape de qualité ne passe pas, empêchant ainsi le merge de code défaillant.

### Commandes essentielles

```bash
# Lancer l'application
docker compose up -d --build

# Vérifier les logs
docker compose logs -f

# Arrêter l'application
docker compose down

# Nettoyer complètement
docker compose down -v
```

### Deadline

5 jours ouvrés.

Bon développement 😉

## Modalités d'évaluation

### Tests croisés entre apprenants

**Organisation :** Binômes ou trinômes d'apprenants testent mutuellement leurs projets

#### Protocole de test (15 minutes par projet)

1. **Test de l'infrastructure** (5 min)
   - Cloner le repository du pair
   - Lancer l'application avec `docker compose up`
   - Vérifier que tous les services démarrent sans erreur

2. **Test fonctionnel** (5 min)
   - Tester le bouton "Health"
   - Vérifier que l'API confirme la connexion à la BDD
   - Contrôler la communication frontend/backend

3. **Vérification qualité** (5 min)
   - Vérifier le passage des GitHub Actions
   - Tester les outils de linting localement
   - Valider la structure du projet

#### Grille d'évaluation par les pairs

Les testeurs devront compléter une grille avec les critères suivants :
- ✅ Docker Compose fonctionne du premier coup
- ✅ L'API répond correctement
- ✅ Le frontend affiche le message
- ✅ GitHub Actions est configuré et passe
- ✅ Les outils de qualité sont en place
- ✅ La documentation est claire

## Livrables

Un dépôt GitHub contenant :
- **Code source** complet et fonctionnel
- **README.md** avec instructions d'installation
- **Docker Compose** configuré
- **GitHub Actions** fonctionnel
- **Outils de qualité** (ESLint, Prettier, ...Husky ou Lefhook)

## Critères de performance

| Critère | Validation |
|---------|------------|
| L'environnement se lance avec Docker Compose | ✅ Un seul comando suffit |
| L'API retourne les données de la DB | ✅ Endpoint GET fonctionnel |
| Le frontend affiche le message de la DB | ✅ Pas dans console.log 😁 |
| Outils de formatage et lint configurés pour Front/Back | ✅ Sans erreurs |
| hooks Git fonctionnels | ✅ Vérifie le code avant commit/push  |
| GitHub Actions configuré | ✅ CI/CD sur pull requests |

## Stack technique

### Backend (au choix)
- **Node.js** (Express, Fastify, NestJS)
- **PHP** (Symfony, Laravel, Slim)
- **Java** (Spring Boot, Quarkus)
- **Python** (FastAPI, Django, Flask)
- **C#** (.NET Core)

### Frontend (au choix)
- **React** avec Vite
- **Vue.js** 3
- **Angular** 17+
- **Svelte**

### Base de données (au choix)
- **PostgreSQL**
- **MySQL**  
- **MongoDB**
- **SQLite** (pour développement local)

### DevOps (imposé)
- **Docker** & **Docker Compose**
- **GitHub Actions** pour CI/CD
- **Outils de qualité** adaptés à votre langage

## Ressources

### Outils de qualité par langage

**JavaScript/TypeScript**
- [ESLint](https://eslint.org/docs/user-guide/getting-started)
- [Prettier](https://prettier.io/docs/en/install.html)
- [Husky](https://typicode.github.io/husky/getting-started.html)

**PHP**
- [PHP_CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer)
- [PHPStan](https://phpstan.org/)
- [GrumPHP](https://github.com/phpro/grumphp)

**Java**
- [Checkstyle](https://checkstyle.sourceforge.io/)
- [SpotBugs](https://spotbugs.github.io/)
- [Google Java Format](https://github.com/google/google-java-format)

**Python**
- [Flake8](https://flake8.pycqa.org/en/latest/)
- [Black](https://black.readthedocs.io/)
- [pre-commit](https://pre-commit.com/)

## Auteurs, contributeurs

* Jean-Baptiste Lavisse
* Christophe Delobel