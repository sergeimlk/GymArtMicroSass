module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // nouvelle fonctionnalité
        'fix',      // correction de bug
        'docs',     // documentation
        'style',    // formatage
        'refactor', // refactoring
        'test',     // ajout de tests
        'chore',    // maintenance
        'ci',       // intégration continue
        'perf',     // performance
        'build'     // build system
      ]
    ],
    'subject-case': [2, 'never', ['pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72]
  }
};
