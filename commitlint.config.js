module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Format imposé: 🚀feat: description ou 📄docs: description
    'header-pattern': [
      2,
      'always',
      /^[\p{Emoji_Presentation}\p{Emoji}\u{FE0F}]+(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .{1,100}$/u,
    ],
    'header-max-length': [2, 'always', 120],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 🚀 nouvelle fonctionnalité
        'fix',      // 🐛 correction de bug
        'docs',     // 📄 documentation
        'style',    // 💅 formatage, style
        'refactor', // ♻️ refactoring
        'test',     // 🧪 ajout/modification de tests
        'chore',    // 🔧 maintenance
        'perf',     // ⚡ amélioration de performance
        'ci',       // 👷 CI/CD
        'build',    // 📦 build/dépendances
        'revert',   // ⏪ annulation de commit
      ],
    ],
  },
  // Messages d'erreur personnalisés
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
  prompt: {
    messages: {
      type: 'Sélectionnez le type de changement que vous commitez:',
      subject: 'Écrivez une description courte et impérative du changement (avec emoji au début):\n',
      body: 'Fournissez une description plus détaillée du changement (optionnel):\n',
      footer: 'Listez les BREAKING CHANGES ou fermez les issues (optionnel):\n',
    },
    questions: {
      type: {
        description: 'Type de commit (précédé d\'un emoji):',
        enum: {
          feat: {
            description: '🚀 Une nouvelle fonctionnalité',
            title: 'Features',
            emoji: '🚀',
          },
          fix: {
            description: '🐛 Une correction de bug',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: '📄 Documentation seulement',
            title: 'Documentation',
            emoji: '📄',
          },
          style: {
            description: '💅 Changements qui n\'affectent pas le sens du code',
            title: 'Styles',
            emoji: '💅',
          },
          refactor: {
            description: '♻️ Un changement de code qui ne corrige ni n\'ajoute de fonctionnalité',
            title: 'Code Refactoring',
            emoji: '♻️',
          },
          perf: {
            description: '⚡ Un changement de code qui améliore les performances',
            title: 'Performance Improvements',
            emoji: '⚡',
          },
          test: {
            description: '🧪 Ajout de tests manquants ou correction de tests existants',
            title: 'Tests',
            emoji: '🧪',
          },
          build: {
            description: '📦 Changements qui affectent le système de build ou les dépendances externes',
            title: 'Builds',
            emoji: '📦',
          },
          ci: {
            description: '👷 Changements aux fichiers et scripts de configuration CI',
            title: 'Continuous Integrations',
            emoji: '👷',
          },
          chore: {
            description: '🔧 Autres changements qui ne modifient pas src ou les fichiers de test',
            title: 'Chores',
            emoji: '🔧',
          },
          revert: {
            description: '⏪ Annule un commit précédent',
            title: 'Reverts',
            emoji: '⏪',
          },
        },
      },
    },
  },
};
