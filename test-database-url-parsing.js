#!/usr/bin/env node

// Test de parsing de DATABASE_URL
const { URL } = require('url');

console.log('🔍 Test de parsing DATABASE_URL');
console.log('================================');

// URL incorrecte (avec préfixe)
const badUrl = 'DATABASE_URL=postgresql://gymart_user:rMswxyMD6167Q9uxNqRSrPnRoQYbpzxL@dpg-d36i9s6mcj7s73dk15j0-a.frankfurt-postgres.render.com/gymart';

// URL correcte (sans préfixe)
const goodUrl = 'postgresql://gymart_user:rMswxyMD6167Q9uxNqRSrPnRoQYbpzxL@dpg-d36i9s6mcj7s73dk15j0-a.frankfurt-postgres.render.com/gymart';

console.log('❌ URL incorrecte:', badUrl);
console.log('✅ URL correcte:', goodUrl);

console.log('\n🔍 Test de parsing...\n');

// Test URL incorrecte
try {
  const badParsed = new URL(badUrl);
  console.log('❌ URL incorrecte parsée:', {
    protocol: badParsed.protocol,
    hostname: badParsed.hostname,
    port: badParsed.port,
    pathname: badParsed.pathname,
    username: badParsed.username
  });
} catch (err) {
  console.log('❌ Erreur parsing URL incorrecte:', err.message);
}

// Test URL correcte
try {
  const goodParsed = new URL(goodUrl);
  console.log('✅ URL correcte parsée:', {
    protocol: goodParsed.protocol,
    hostname: goodParsed.hostname,
    port: goodParsed.port,
    pathname: goodParsed.pathname,
    username: goodParsed.username
  });
} catch (err) {
  console.log('❌ Erreur parsing URL correcte:', err.message);
}

console.log('\n💡 Solution: Supprimez "DATABASE_URL=" du début de la variable dans Render !');
