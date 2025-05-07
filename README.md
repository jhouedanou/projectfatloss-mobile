# Project Fat Loss

Application web mobile pour suivre un programme d'entraînement avec calcul des calories brûlées.

## Fonctionnalités
- Navigation par jour
- Timer intégré, pause automatique entre exercices
- Progression étape par étape (un exercice à la fois)
- Miniatures pour chaque exercice
- Design responsive et moderne
- **Suivi des calories brûlées par exercice et par jour**
- **Animation des calories brûlées après chaque série**
- **Écran récapitulatif en fin de journée avec félicitations**

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
git remote add origin https://github.com/jhouedanou/projectfatloss.git
git push -u origin main
   ```
2. Installe gh-pages (déjà fait):
   ```bash
npm install --save-dev gh-pages
   ```
3. Configuration vite.config.js (déjà fait):
   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/projectfatloss/',
   });
   ```
4. Déploie :
   ```bash
npm run deploy
   ```

### Vercel
- Connecte ton repo sur https://vercel.com, tout fonctionne par défaut (Vite/React).

## Auteur
Adapté par Cascade AI
