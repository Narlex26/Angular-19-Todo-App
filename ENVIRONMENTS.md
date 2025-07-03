# Environnements de développement

Ce projet Angular est configuré avec trois environnements distincts :

## 🛠️ Développement (par défaut)
- **Configuration** : `development`
- **Fichier** : `src/environments/environment.ts`
- **URL API** : `http://localhost:3000/api`
- **Commandes** :
  - `npm start` ou `npm run start:dev` - Lance le serveur de développement
  - `npm run build` ou `npm run build:dev` - Build pour le développement

## 🚀 Staging
- **Configuration** : `staging`
- **Fichier** : `src/environments/environment.staging.ts`
- **URL API** : `http://212.83.131.87/api`
- **Commandes** :
  - `npm run start:staging` - Lance le serveur en mode staging
  - `npm run build:staging` - Build pour le staging

## 🌐 Production
- **Configuration** : `production`
- **Fichier** : `src/environments/environment.production.ts`
- **URL API** : `http://212.83.131.87/api`
- **Commandes** :
  - `npm run start:prod` - Lance le serveur en mode production
  - `npm run build:prod` - Build pour la production

## 📁 Structure des fichiers d'environnement

- `src/environments/environment.ts` - **Développement (par défaut)** - utilisé directement
- `src/environments/environment.staging.ts` - Staging - remplace environment.ts lors du build
- `src/environments/environment.production.ts` - Production - remplace environment.ts lors du build

## 🔧 Configuration CI/CD

Pour votre CI/CD, utilisez les commandes de build appropriées :

```bash
# Pour le staging
npm run build:staging

# Pour la production
npm run build:prod
```

Les builds seront générés dans le dossier `dist/apps` avec les optimisations appropriées pour chaque environnement.
