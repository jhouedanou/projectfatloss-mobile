# Semaine Muscu Mobile

Application web mobile pour suivre un programme de musculation sur 7 jours.

## Fonctionnalités
- Navigation par jour
- Timer intégré, pause automatique entre exercices
- Progression étape par étape (un exercice à la fois)
- Miniatures pour chaque exercice
- Design responsive et moderne

## Démarrage local

```bash
npm install
npm run dev
```

## Déploiement

### GitHub Pages

1. Initialise un repo git, pousse sur GitHub :
   ```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/<ton-user>/<ton-repo>.git
git push -u origin main
   ```
2. Installe gh-pages :
   ```bash
npm install --save-dev gh-pages
   ```
3. Ajoute dans `package.json` :
   ```json
   "homepage": "https://<ton-user>.github.io/<ton-repo>"
   ```
   Et les scripts :
   ```json
   "predeploy": "vite build",
   "deploy": "gh-pages -d dist"
   ```
4. Déploie :
   ```bash
npm run deploy
   ```

### Vercel
- Connecte ton repo sur https://vercel.com, tout fonctionne par défaut (Vite/React).

## Auteur
Adapté par Cascade AI
