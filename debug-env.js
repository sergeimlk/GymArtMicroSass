#!/usr/bin/env node

// Script de debug pour les variables d'environnement
console.log('🔍 DEBUG: Variables d\'environnement');
console.log('=====================================');

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('');

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'DÉFINIE' : 'NON DÉFINIE');
if (process.env.DATABASE_URL) {
  // Masquer le password pour la sécurité
  const maskedUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':***@');
  console.log('DATABASE_URL (masquée):', maskedUrl);
}
console.log('');

console.log('Variables DB_* individuelles:');
console.log('DB_HOST:', process.env.DB_HOST || 'NON DÉFINIE');
console.log('DB_PORT:', process.env.DB_PORT || 'NON DÉFINIE');
console.log('DB_NAME:', process.env.DB_NAME || 'NON DÉFINIE');
console.log('DB_USER:', process.env.DB_USER || 'NON DÉFINIE');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'DÉFINIE' : 'NON DÉFINIE');
console.log('');

console.log('Variables POSTGRES_* (fallback):');
console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST || 'NON DÉFINIE');
console.log('POSTGRES_PORT:', process.env.POSTGRES_PORT || 'NON DÉFINIE');
console.log('POSTGRES_DB:', process.env.POSTGRES_DB || 'NON DÉFINIE');
console.log('POSTGRES_USER:', process.env.POSTGRES_USER || 'NON DÉFINIE');
console.log('POSTGRES_PASSWORD:', process.env.POSTGRES_PASSWORD ? 'DÉFINIE' : 'NON DÉFINIE');
console.log('');

console.log('Toutes les variables d\'environnement (filtrées):');
Object.keys(process.env)
  .filter(key => key.includes('DB') || key.includes('POSTGRES') || key.includes('DATABASE'))
  .sort()
  .forEach(key => {
    const value = key.includes('PASSWORD') ? '***' : process.env[key];
    console.log(`${key}:`, value);
  });
