# 🎲 Perudo — Instructions de déploiement

## Structure du projet
```
perudo-server/
├── server.js          ← Serveur Node.js (WebSockets)
├── package.json
├── render.yaml        ← Config déploiement Render.com
└── public/
    └── index.html     ← Le jeu (servi automatiquement)
```

---

## 🚀 Déploiement sur Render.com (GRATUIT)

### Étape 1 — Créer un compte GitHub
- Va sur https://github.com et crée un compte (si pas déjà fait)

### Étape 2 — Mettre le code sur GitHub
1. Va sur https://github.com/new
2. Nom du repo : `perudo-game`
3. Clique **Create repository**
4. Uploade tous les fichiers (glisse-dépose dans l'interface GitHub)
   - `server.js`
   - `package.json`
   - `render.yaml`
   - le dossier `public/` avec `index.html` dedans

### Étape 3 — Déployer sur Render
1. Va sur https://render.com et crée un compte (gratuit)
2. Clique **New → Web Service**
3. Connecte ton compte GitHub et sélectionne `perudo-game`
4. Render détecte automatiquement la config grâce à `render.yaml`
5. Clique **Create Web Service**
6. Attends 2-3 minutes → ton URL apparaît : `https://perudo-game.onrender.com`

### Étape 4 — Jouer !
- Partage l'URL à tous tes amis
- Chacun ouvre le lien sur son téléphone
- Choisissez un prénom + une couleur + le même code de partie
- C'est parti ! 🎲

---

## ⚠️ Note importante sur Render (plan gratuit)
Le plan gratuit "endort" le serveur après 15 min d'inactivité.
Le premier joueur qui se connecte après une pause attendra ~30 secondes.
Pour éviter ça, passe au plan "Starter" ($7/mois) ou utilise Railway.app.

---

## 🔧 Tester en local (optionnel)
```bash
npm install
node server.js
# Ouvre http://localhost:3000
```
