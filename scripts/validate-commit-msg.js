#!/usr/bin/env node

/**
 * Script de validation des messages de commit
 * Impose le format: <emoji><type>: <description>
 */

const fs = require('fs');
const path = require('path');

// Récupérer le message de commit
const commitMsgFile = process.argv[2];
if (!commitMsgFile) {
  console.error('❌ Erreur: Fichier de message de commit non fourni');
  process.exit(1);
}

const commitMsg = fs.readFileSync(commitMsgFile, 'utf8').trim();

// Extraire seulement la première ligne (header)
const commitHeader = commitMsg.split('\n')[0].trim();

// Regex pour valider le format emoji + type
const emojiTypeRegex =
  /^[\p{Emoji_Presentation}\p{Emoji}\u{FE0F}]+(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .+$/u;

// Types autorisés avec leurs emojis recommandés
const typeEmojiMap = {
  feat: '🚀',
  fix: '🐛',
  docs: '📄',
  style: '💅',
  refactor: '♻️',
  test: '🧪',
  chore: '🔧',
  perf: '⚡',
  ci: '👷',
  build: '📦',
  revert: '⏪',
};

// Ignorer les commits de merge
if (commitHeader.startsWith('Merge ') || commitHeader.startsWith('Revert ')) {
  console.log('✅ Commit de merge/revert autorisé');
  process.exit(0);
}

// Valider le format
if (!emojiTypeRegex.test(commitHeader)) {
  console.error(`❌ Message de commit invalide!

Format OBLIGATOIRE: <emoji><type>: <description>

Types autorisés avec emojis:
- 🚀feat: nouvelle fonctionnalité
- 🐛fix: correction de bug
- 📄docs: documentation
- 💅style: formatage
- ♻️refactor: refactoring
- 🧪test: ajout de tests
- 🔧chore: maintenance
- 👷ci: intégration continue
- ⚡perf: amélioration de performance
- 📦build: build/dépendances
- ⏪revert: annulation de commit

Exemples VALIDES:
✅ 🚀feat: add user authentication
✅ 🐛fix: resolve database connection
✅ 📄docs: update API documentation

Exemples INVALIDES:
❌ feat: add user authentication (manque emoji)
❌ 🚀 feat: add user authentication (espace)
❌ 🚀feat: Add user authentication (majuscule)

Votre header: "${commitHeader}"

Voir COMMIT_CONVENTIONS.md pour plus de détails.`);

  process.exit(1);
}

// Vérifier la longueur du header
if (commitHeader.length > 120) {
  console.error(`❌ Header trop long (${commitHeader.length} caractères, max 120)

Votre header: "${commitHeader}"`);
  process.exit(1);
}

// Vérifier qu'il n'y a pas de point final dans le header
if (commitHeader.endsWith('.')) {
  console.error(`❌ Le header ne doit pas se terminer par un point

Votre header: "${commitHeader}"`);
  process.exit(1);
}

console.log('✅ Format de commit valide!');
process.exit(0);
