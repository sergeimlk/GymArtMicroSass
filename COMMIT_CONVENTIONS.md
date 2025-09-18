# 📝 Conventions de Commit - GymArt

## Format Obligatoire

**Tous les commits DOIVENT commencer par un emoji suivi du type :**

```
🚀feat: add new user authentication system
📄docs: update API documentation
🐛fix: resolve database connection timeout
💅style: format code with prettier
```

## 🎯 Format Exact

```
<emoji><type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Exemples Valides ✅

```bash
🚀feat: add user registration endpoint
🐛fix(api): resolve PostgreSQL connection issue
📄docs: complete API documentation
💅style: format all JavaScript files
♻️refactor(client): improve component structure
🧪test: add integration tests for health endpoint
🔧chore: update dependencies
⚡perf: optimize database queries
👷ci: add GitHub Actions workflow
📦build: update Docker configuration
⏪revert: undo previous commit
```

### Exemples Invalides ❌

```bash
feat: add new feature                    # ❌ Manque l'emoji
🚀 feat: add new feature                 # ❌ Espace entre emoji et type
add new feature                          # ❌ Pas de type
🚀feat Add new feature                   # ❌ Manque les deux points
🚀feat: Add new feature                  # ❌ Description en majuscule
🚀feat: add new feature.                 # ❌ Point final interdit
```

## 📋 Types de Commit Autorisés

| Emoji | Type | Description | Exemple |
|-------|------|-------------|---------|
| 🚀 | `feat` | Nouvelle fonctionnalité | `🚀feat: add user dashboard` |
| 🐛 | `fix` | Correction de bug | `🐛fix: resolve login error` |
| 📄 | `docs` | Documentation | `📄docs: update README` |
| 💅 | `style` | Formatage, style | `💅style: format with prettier` |
| ♻️ | `refactor` | Refactoring | `♻️refactor: improve code structure` |
| 🧪 | `test` | Tests | `🧪test: add unit tests` |
| 🔧 | `chore` | Maintenance | `🔧chore: update dependencies` |
| ⚡ | `perf` | Performance | `⚡perf: optimize queries` |
| 👷 | `ci` | CI/CD | `👷ci: add GitHub Actions` |
| 📦 | `build` | Build/dépendances | `📦build: update Dockerfile` |
| ⏪ | `revert` | Annulation | `⏪revert: undo previous commit` |

## 🚨 Messages d'Erreur

### Erreur : Format invalide

```bash
❌ commit-msg hook failed (add --no-verify to bypass)
⚠ input: feat: add new feature
✖ header must match pattern

💡 Format attendu: 🚀feat: add new feature
```

### Erreur : Type invalide

```bash
❌ commit-msg hook failed (add --no-verify to bypass)
⚠ input: 🚀feature: add new feature
✖ type must be one of [feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert]

💡 Format attendu: 🚀feat: add new feature
```

## 🛠️ Outils et Helpers

### Commande pour Tester

```bash
# Tester un message de commit
echo "🚀feat: add new feature" | npx commitlint

# Tester depuis un fichier
echo "🚀feat: add new feature" > commit.txt
npx commitlint --from commit.txt
```

### Git Alias Utiles

```bash
# Ajouter à ~/.gitconfig
[alias]
  cf = "!f() { git commit -m \"🚀feat: $1\"; }; f"
  cb = "!f() { git commit -m \"🐛fix: $1\"; }; f"
  cd = "!f() { git commit -m \"📄docs: $1\"; }; f"
  cs = "!f() { git commit -m \"💅style: $1\"; }; f"

# Usage
git cf "add user authentication"  # → 🚀feat: add user authentication
git cb "resolve login issue"      # → 🐛fix: resolve login issue
```

---

**📝 Note** : Cette convention est appliquée automatiquement par les hooks Git et le pipeline CI/CD.
