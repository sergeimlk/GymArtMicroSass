#!/usr/bin/env node

const { Pool, Client } = require('pg');

// URL complète de la base Render
const DATABASE_URL = 'postgresql://gymart_user:rMswxyMD6167Q9uxNqRSrPnRoQYbpzxL@dpg-d36i9s6mcj7s73dk15j0-a.frankfurt-postgres.render.com/gymart';

console.log('🔍 Test de connexion à la base Render');
console.log('=====================================');

// Configuration avec DATABASE_URL
const configUrl = {
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
};

// Configuration avec paramètres individuels
const configIndividual = {
  host: 'dpg-d36i9s6mcj7s73dk15j0-a.frankfurt-postgres.render.com',
  port: 5432,
  database: 'gymart',
  user: 'gymart_user',  // ← ATTENTION: c'est gymart_user, pas postgres !
  password: 'rMswxyMD6167Q9uxNqRSrPnRoQYbpzxL',
  ssl: { rejectUnauthorized: false }
};

console.log('📋 Configuration URL:', {
  connectionString: 'postgresql://gymart_user:***@dpg-xxx.../gymart',
  ssl: configUrl.ssl
});

console.log('📋 Configuration individuelle:', {
  host: configIndividual.host,
  port: configIndividual.port,
  database: configIndividual.database,
  user: configIndividual.user,
  ssl: configIndividual.ssl,
  hasPassword: !!configIndividual.password
});

async function testConnection(config, name) {
  console.log(`\n🔄 Test ${name}...`);
  
  try {
    const client = new Client(config);
    await client.connect();
    console.log(`✅ ${name}: Connexion réussie !`);
    
    // Test d'une requête simple
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log(`✅ ${name}: Requête réussie !`);
    console.log(`   - Heure: ${result.rows[0].current_time}`);
    console.log(`   - Version: ${result.rows[0].pg_version.split(' ')[0]}`);
    
    await client.end();
    return true;
  } catch (err) {
    console.error(`❌ ${name}: Échec de connexion`);
    console.error(`   - Message: ${err.message}`);
    console.error(`   - Code: ${err.code}`);
    console.error(`   - Name: ${err.name}`);
    
    if (err.code === 'ENOTFOUND') {
      console.error('   - Problème: DNS - Host introuvable');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('   - Problème: Connexion refusée - Service non disponible');
    } else if (err.code === 'ETIMEDOUT') {
      console.error('   - Problème: Timeout de connexion');
    } else if (err.message.includes('terminated unexpectedly')) {
      console.error('   - Problème: Authentification - Mauvais user/password');
    } else if (err.message.includes('password authentication failed')) {
      console.error('   - Problème: Mot de passe incorrect');
    } else if (err.message.includes('role') && err.message.includes('does not exist')) {
      console.error('   - Problème: Utilisateur inexistant');
    }
    
    return false;
  }
}

async function main() {
  console.log('\n🚀 Démarrage des tests...\n');
  
  const test1 = await testConnection(configUrl, 'DATABASE_URL');
  const test2 = await testConnection(configIndividual, 'Paramètres individuels');
  
  console.log('\n📊 Résumé des tests:');
  console.log(`   - DATABASE_URL: ${test1 ? '✅ OK' : '❌ ÉCHEC'}`);
  console.log(`   - Paramètres individuels: ${test2 ? '✅ OK' : '❌ ÉCHEC'}`);
  
  if (test1 || test2) {
    console.log('\n🎉 Au moins une méthode fonctionne !');
    console.log('💡 Utilisez la configuration qui marche dans Render.');
  } else {
    console.log('\n🚨 Aucune méthode ne fonctionne !');
    console.log('💡 Vérifiez les credentials dans Render Dashboard.');
  }
}

main().catch(console.error);
