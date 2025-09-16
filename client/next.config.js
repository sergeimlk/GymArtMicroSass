/** @type {import('next').NextConfig} */
const nextConfig = {
  // OBLIGATOIRE pour Docker et déploiement
  output: 'standalone',

  // Configuration des images
  images: {
    unoptimized: true,
  },

  // Variables d'environnement
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },

  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
