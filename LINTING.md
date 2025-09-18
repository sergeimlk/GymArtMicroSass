# 🧹 Guide ESLint, Prettier & Git Hooks - Issue #9

## 📋 Vue d'ensemble

Configuration complète de linting, formatage et hooks Git pour assurer la qualité du code sur tout le monorepo GymArt.

## 🛠️ Configuration mise en place

### **ESLint**

#### API (Backend - JavaScript)
- **Fichier** : `api/.eslintrc.json`
- **Règles** : Standard JavaScript avec règles strictes
- **Scripts** : `npm run lint`, `npm run lint:fix`

#### Client (Frontend - TypeScript/React)
- **Fichier** : `client/.eslintrc.json`
- **Règles** : Next.js + TypeScript + React
- **Scripts** : `npm run lint`, `npm run lint:fix`

### **Prettier**

#### Configuration globale
- **Fichier** : `.prettierrc` (racine)
- **Spécifiques** : `api/.prettierrc`, `client/.prettierrc`
- **Scripts** : `npm run format`, `npm run format:check`

### **Git Hooks (Lefthook)**

#### Pre-commit
- ✅ **Prettier** : Formatage automatique avec `stage_fixed`
- ✅ **ESLint API** : Linting backend avec auto-fix
- ✅ **ESLint Client** : Linting frontend avec auto-fix
- ✅ **TypeScript** : Vérification des types
- ✅ **Structure** : Validation monorepo

#### Pre-push
- 🔒 **Audit sécurité** : `npm audit` pour API et Client
- 🧪 **Tests** : Exécution des tests (si configurés)
- 🏗️ **Build** : Vérification du build client
- 🔍 **Lint final** : Vérification sans auto-fix
- 💚 **Health checks** : API et DB (si démarrés)

## 🚀 Utilisation

### **Scripts npm disponibles**

#### API (Backend)
```bash
cd api
npm run lint          # Vérifier les erreurs ESLint
npm run lint:fix       # Corriger automatiquement
npm run format         # Formater avec Prettier
npm run format:check   # Vérifier le formatage
```

#### Client (Frontend)
```bash
cd client
npm run lint           # Vérifier les erreurs ESLint
npm run lint:fix       # Corriger automatiquement
npm run format         # Formater avec Prettier
npm run format:check   # Vérifier le formatage
npm run type-check     # Vérifier TypeScript
```

### **Workflow de développement**

1. **Développement normal** : Les hooks s'exécutent automatiquement
2. **Commit** : Pre-commit hooks corrigent automatiquement
3. **Push** : Pre-push hooks vérifient la sécurité et les builds

## 🧪 Tests et validation

### **Test des hooks**

```bash
# Créer un fichier avec erreurs volontaires
echo "const unused = 'test'  // Erreur volontaire" > api/src/test.js

# Tenter un commit (sera bloqué ou corrigé)
git add api/src/test.js
git commit -m "test: erreur volontaire"

# Nettoyer
rm api/src/test.js
```

### **Validation manuelle**

```bash
# Vérifier ESLint
cd api && npm run lint
cd client && npm run lint

# Vérifier Prettier
cd api && npm run format:check
cd client && npm run format:check

# Audit sécurité
cd api && npm audit
cd client && npm audit
```

## 📊 Règles configurées

### **ESLint - Règles communes**
- `quotes: single` - Guillemets simples obligatoires
- `semi: always` - Points-virgules obligatoires
- `no-unused-vars` - Variables non utilisées interdites
- `no-var` - `var` interdit, utiliser `const`/`let`
- `prefer-const` - Préférer `const` quand possible
- `no-trailing-spaces` - Pas d'espaces en fin de ligne
- `comma-dangle: es5` - Virgules finales selon ES5

### **Prettier - Configuration**
- `singleQuote: true` - Guillemets simples
- `semi: true` - Points-virgules
- `tabWidth: 2` - Indentation 2 espaces
- `printWidth: 80` - Largeur maximale 80 caractères
- `trailingComma: es5` - Virgules finales ES5

### **TypeScript (Client uniquement)**
- `@typescript-eslint/no-unused-vars` - Variables TS non utilisées
- `@typescript-eslint/no-explicit-any` - Warning sur `any`
- `react-hooks/exhaustive-deps` - Dépendances React hooks

## 🔒 Sécurité

### **Audit automatique**
- **Niveau** : `moderate` (bloque les vulnérabilités modérées+)
- **Fréquence** : À chaque push
- **Action** : Échec du push si vulnérabilités détectées

### **Résolution des vulnérabilités**
```bash
# Audit détaillé
npm audit

# Correction automatique (attention aux breaking changes)
npm audit fix

# Correction forcée (risqué)
npm audit fix --force
```

## 🚨 Dépannage

### **Problèmes courants**

**ESLint ne trouve pas les fichiers**
```bash
# Vérifier les globs dans lefthook.yml
# S'assurer que les fichiers sont dans les bons dossiers
```

**Prettier échoue**
```bash
# Vérifier la syntaxe des .prettierrc
# Valeurs autorisées pour trailingComma: "es5", "all", "none"
```

**Hooks ne s'exécutent pas**
```bash
# Réinstaller lefthook
lefthook install

# Vérifier la configuration
lefthook version
```

**Conflits entre ESLint et Prettier**
```bash
# Les configurations sont alignées
# Prettier s'exécute avant ESLint dans les hooks
```

## ✅ Critères d'acceptation validés

- ✅ **ESLint opérationnel** dans `api/` et `client/`
- ✅ **Prettier opérationnel** dans `api/` et `client/`
- ✅ **Pre-commit** : lint + format automatique
- ✅ **Pre-push** : audit sécurité + vérifications
- ✅ **Scripts npm** : Tous les scripts de linting/formatage
- ✅ **Tests** : Hooks testés avec erreurs volontaires
- ✅ **Blocage** : Commits non conformes bloqués/corrigés

## 🎯 Prochaines étapes

Après validation de l'Issue #9 :
- Issue #10 : Tests unitaires et d'intégration
- Issue #11 : CI/CD avec GitHub Actions
- Issue #12 : Documentation finale et validation
