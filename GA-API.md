# Présentation : Le "Health Check", validation de notre infrastructure Full-Stack

Bonjour à tous. Aujourd'hui, je vais vous présenter le fonctionnement de la fonctionnalité de "Health Check" de notre application. Ce n'est pas juste une simple fonctionnalité, mais la **validation de toute notre fondation technique**, comme l'exigeait le brief du projet.

### Le "Pourquoi" : L'Objectif du Health Check

Le brief était clair : avant de construire les fonctionnalités métier, nous devions mettre en place une **infrastructure robuste** composée de trois services qui communiquent entre eux : un frontend, un backend (API), et une base de données.

Le "Health Check" est la première fonctionnalité end-to-end qui prouve que cette infrastructure est non seulement en place, mais qu'elle est **pleinement opérationnelle**.

En un clic, nous allons vérifier que :
1.  Le **Frontend** (notre client React) peut envoyer une requête au Backend.
2.  Le **Backend** (notre API Express) peut recevoir cette requête.
3.  Le **Backend** peut se connecter avec succès à la **Base de Données** (PostgreSQL).
4.  La réponse remonte toute la chaîne jusqu'à l'utilisateur.

C'est la matérialisation du critère de performance : "L'environnement se lance avec Docker Compose" et "L'API retourne les données de la DB".

---

## Les Acteurs : Nos Trois Services

Notre architecture, définie dans le `compose.yml`, repose sur trois piliers :

1.  **Le Client (Frontend)** : Une application Next.js (React) qui constitue l'interface utilisateur. C'est la porte d'entrée de notre application.
2.  **Le Serveur (Backend)** : Une API REST développée avec Node.js et Express. C'est le cerveau qui contient la logique.
3.  **La Base de Données (DB)** : Un service PostgreSQL. C'est la mémoire de notre application.

Le Health Check va faire voyager une requête à travers ces trois services.

---

## Le Voyage d'une Requête : Explication Étape par Étape

Suivons ensemble le parcours de la requête, en nous référant constamment au brief.

### Étape 1 : L'Action Utilisateur (Frontend)

Le brief demande explicitement : "**Un bouton de test : 'Tester la connexion API'**".

Voici comment nous l'avons implémenté dans notre composant React.

- **Fichier** : `client/src/app/page.tsx`
- **Code** :
  ```tsx
  <button
    onClick={testApiConnection}
    disabled={isLoading}
    // ... classes de style
  >
    <span>Tester la connexion API</span>
  </button>
  ```
- **Explication** : Un simple clic sur ce bouton déclenche la fonction `testApiConnection`. On utilise également un état `isLoading` pour désactiver le bouton pendant l'appel, offrant un retour visuel immédiat à l'utilisateur.

### Étape 2 : La Requête HTTP s'envole (Frontend)

Le brief précise : "**Requête HTTP GET vers `/api/health`**" et "**Gestion des cas de succès et d'erreur**".

La fonction `testApiConnection` s'en charge en utilisant `fetch`.

- **Fichier** : `client/src/app/page.tsx`
- **Code** :
  ```tsx
  const testApiConnection = async () => {
    setIsLoading(true);
    // ...
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/health`); // Envoi de la requête GET
      const data = await res.json(); // Lecture de la réponse
      setResponse(data); // Stockage de la réponse pour l'affichage
    } catch (err) {
      setError("Impossible de contacter l'API"); // Gestion de l'erreur réseau
    } finally {
      setIsLoading(false);
    }
  };
  ```
- **Explication** :
    1.  On utilise `async/await` pour gérer l'asynchronisme de l'appel réseau.
    2.  L'URL de l'API est récupérée depuis les variables d'environnement, une bonne pratique pour ne pas la coder en dur.
    3.  Un bloc `try...catch` est essentiel ici. Le `try` gère le "cas heureux" où le serveur répond. Le `catch` intercepte les erreurs réseau (si le serveur est éteint, par exemple). C'est notre première couche de gestion d'erreur.

### Étape 3 : L'Arrivée au Poste de Contrôle (Backend)

Notre API Express reçoit la requête. Le brief exige : "**Un endpoint de test : `GET /api/health`**".

- **Fichier** : `api/src/index.js`
- **Code** :
  ```javascript
  app.get('/api/health', async (req, res) => {
    // ... la logique suit ici
  });
  ```
- **Explication** : C'est le système de routage d'Express. Il agit comme un aiguilleur, dirigeant toute requête `GET` arrivant sur `/api/health` vers la fonction que nous allons maintenant détailler.

### Étape 4 : Le Test Crucial (Backend & Base de Données)

Le brief demande : "**Test de connexion à BDD (exécution d'un SELECT simple)**".

- **Fichier** : `api/src/index.js`
- **Code** :
  ```javascript
  try {
    // Test de la connexion à la base de données avec SELECT 1
    await pool.query('SELECT 1');

    // Si on arrive ici, la requête a réussi.
    res.json({ status: 'ok', message: 'API connected to database!' });
  } catch (error) {
    // Si pool.query échoue, le code saute directement ici.
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
  ```
- **Explication** :
    1.  `pool.query('SELECT 1')` est la commande clé. On ne sélectionne aucune donnée de table. On demande simplement à la base de données de nous répondre "1". Si elle y parvient, cela prouve que la connexion est valide et fonctionnelle.
    2.  Le `try...catch` est ici fondamental. Il sépare le chemin du succès de celui de l'échec, exactement comme le brief le demande.

### Étape 5 : La Réponse Conforme (Backend)

Le brief est très strict sur le format de la réponse : un JSON avec un champ `status`.

- **Fichier** : `api/src/index.js`
- **Code (détaillé à l'étape 4)** :
    - **Succès** : `res.json({ status: 'ok', message: 'API connected to database!' })`
      - On renvoie un statut HTTP `200 OK` (implicite avec `res.json`) et le corps JSON attendu.
    - **Échec** : `res.status(500).json({ status: 'error', message: 'Database connection failed' })`
      - On renvoie un statut HTTP `500 Internal Server Error` pour signifier une erreur côté serveur, et le corps JSON d'erreur.

### Étape 6 : L'Affichage du Résultat (Frontend)

Dernière exigence du brief : "**Affichage du JSON retourné par l'API**". Le critère de performance précise même : "**Pas dans console.log 😁**".

- **Fichier** : `client/src/app/page.tsx`
- **Code** :
  ```tsx
  {(response || error) && (
    // ...
    <pre>
      <code>{JSON.stringify(response, null, 2)}</code>
    </pre>
    // ...
  )}
  ```
- **Explication** :
    1.  On utilise le rendu conditionnel de React. Si l'objet `response` (ou `error`) n'est pas nul, on affiche la section des résultats.
    2.  `JSON.stringify(response, null, 2)` est la fonction qui prend notre objet de réponse JavaScript et le transforme en une chaîne de caractères JSON joliment formatée (avec une indentation de 2 espaces), prête à être affichée.
    3.  Le résultat est placé dans une balise `<pre>`, qui préserve le formatage, garantissant un affichage clair et lisible pour l'utilisateur, respectant ainsi à la lettre la consigne.

---

## Conclusion : Une Fondation Validée

En suivant ce simple clic, nous avons démontré que :
- **Notre `compose.yml` est fonctionnel** : les trois services sont démarrés et communiquent sur le même réseau Docker.
- **Les variables d'environnement sont correctement chargées** : le frontend connaît l'adresse de l'API, et l'API connaît les identifiants de la base de données.
- **Les contrats d'API sont respectés** : le format des requêtes et des réponses correspond exactement à ce qui a été défini dans le brief.

Ce Health Check n'est donc pas une simple ligne sur une checklist. C'est la preuve vivante que notre socle technique est solide et prêt pour la suite du développement.
