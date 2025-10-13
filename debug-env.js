#!/usr/bin/env node

// Script de debug pour les variables d'environnement
// Permet de vérifier rapidement la configuration chargée depuis le fichier .env
require('dotenv').config({ path: './.env' }); // Charger le .env depuis la racine

const logVar = (name, value, isSecret = false) => {
  if (isSecret) {
    console.log(`${name}:`, value ? 'DÉFINIE (secret)' : 'NON DÉFINIE');
  } else {
    console.log(`${name}:`, value || 'NON DÉFINIE');
  }
};

console.log('🔍 DEBUG: Variables d\'environnement');
console.log('=====================================');

logVar('NODE_ENV', process.env.NODE_ENV);
logVar('PORT', process.env.PORT); // Port utilisé par la plateforme de déploiement (ex: Render)
logVar('API_PORT', process.env.API_PORT); // Port pour le développement local
console.log('');

logVar('DATABASE_URL', process.env.DATABASE_URL, true);
if (process.env.DATABASE_URL) {
  // Masquer le password pour la sécurité
  const maskedUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':***@');
  console.log('DATABASE_URL (masquée):', maskedUrl);
}
console.log('');

console.log('--- Variables DB_* individuelles ---');
logVar('DB_HOST', process.env.DB_HOST);
logVar('DB_PORT', process.env.DB_PORT);
logVar('DB_NAME', process.env.DB_NAME);
logVar('DB_USER', process.env.DB_USER);
logVar('DB_PASSWORD', process.env.DB_PASSWORD, true);
console.log('');

console.log('--- Variables POSTGRES_* (fallback) ---');
logVar('POSTGRES_HOST', process.env.POSTGRES_HOST);
logVar('POSTGRES_PORT', process.env.POSTGRES_PORT);
logVar('POSTGRES_DB', process.env.POSTGRES_DB);
logVar('POSTGRES_USER', process.env.POSTGRES_USER);
logVar('POSTGRES_PASSWORD', process.env.POSTGRES_PASSWORD, true);
console.log('');

console.log('--- Toutes les variables liées à la BDD (filtrées) ---');
Object.keys(process.env)
  .filter(key => key.includes('DB') || key.includes('POSTGRES') || key.includes('DATABASE'))
  .sort()
  .forEach(key => {
    logVar(key, process.env[key], key.includes('PASSWORD') || key.includes('SECRET'));
  });
