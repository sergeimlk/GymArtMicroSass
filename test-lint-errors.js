// Fichier de test avec erreurs volontaires pour tester ESLint/Prettier
// Ce fichier sera supprimé après les tests

const unused_variable = "test"  // Erreur: variable non utilisée + point-virgule manquant

function badFunction( ){  // Erreur: espaces dans les parenthèses
var oldVar = 'test'  // Erreur: utilisation de var au lieu de const/let


  console.log("Hello World")  // Erreur: guillemets doubles au lieu de simples + espaces multiples
}

// Erreur: fonction non utilisée
badFunction()
