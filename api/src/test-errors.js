// Test avec erreurs ESLint volontaires
const unused = 'test'; // Variable non utilisée + point-virgule manquant

function badFunction() {
  // Espaces incorrects
  var oldVar = 'test'; // var au lieu de const

  console.log('Hello'); // Guillemets doubles + espaces multiples
}
