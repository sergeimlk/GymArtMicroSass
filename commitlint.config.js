module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Permettre les emojis au début du message - approche simplifiée
    'subject-case': [0], // Désactiver la vérification de la casse
    'subject-empty': [0], // Désactiver car l'emoji peut être considéré comme vide
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 120], // Augmenter pour les emojis
    'type-empty': [0], // Désactiver car l'emoji peut être avant le type
    'type-enum': [0], // Désactiver pour permettre emoji + type
    'header-case': [0], // Désactiver la vérification de la casse du header
    'header-full-stop': [0] // Désactiver pour plus de flexibilité
  }
};
