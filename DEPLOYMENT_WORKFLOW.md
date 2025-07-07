# 🚀 Workflow de Déploiement - Angular Todo App

Ce document décrit le processus de déploiement automatisé de l'application Angular avec trois environnements distincts et leurs pipelines CI/CD associées.

## 📊 Aperçu des Environnements

| Environnement | Branche | URL API | Déclencheur             | Actions |
|---------------|---------|---------|-------------------------|---------|
| **Development** | `develop` | `http://localhost:3000/api` | Push/Merge/PR → develop | Build + Tests E2E |
| **Staging** | `staging` | `http://212.83.131.87/api` | Push/Merge/PR → staging | Build + Tests E2E + Déploiement |
| **Production** | `main` | `http://212.83.131.87/api` | Push/Merge/PR → main    | Build + Tests E2E + Déploiement |

## 🔄 Flux de Développement

### 1. 🛠️ Environnement de Développement
**Branche :** `develop`

**Déclencheurs :**
- Push sur la branche `develop`
- Pull Request vers la branche `develop`
- Merge vers la branche `develop`

**Actions de la Pipeline :**
```yaml
1. Installation des dépendances (npm install)
2. Build de développement (npm run build:dev)
3. Lancement des tests E2E (npm run cypress:e2e:headless)
4. Validation du code (linting, tests unitaires)
```

**Objectif :** Validation continue du code avant intégration

---

### 2. 🚀 Environnement de Staging
**Branche :** `staging`

**Déclencheurs :**
- Push sur la branche `staging`
- Pull Request vers la branche `staging`
- Merge vers la branche `staging`

**Actions de la Pipeline :**
```yaml
1. Installation des dépendances
2. Build de staging (npm run build:staging)
   ├── Optimisations activées
   ├── Source maps désactivées
   └── Variables d'environnement staging
3. Tests E2E sur l'environnement staging
4. Déploiement automatique vers le serveur de staging
5. Tests de fumée post-déploiement
```

**Objectif :** Tests finaux avant production dans un environnement similaire à la prod

---

### 3. 🌐 Environnement de Production
**Branche :** `main`

**Déclencheurs :**
- Push sur la branche `main`
- Pull Request vers la branche `main`
- Merge vers la branche `main`

**Actions de la Pipeline :**
```yaml
1. Installation des dépendances
2. Build de production (npm run build:prod)
   ├── Optimisations maximales
   ├── Service Worker activé
   ├── Budgets de taille respectés
   └── Variables d'environnement production
3. Tests E2E complets
4. Déploiement en production
5. Tests de santé post-déploiement
6. Notification d'équipe
```

**Objectif :** Déploiement sécurisé en production

## 🎯 Stratégie de Branching

```
main (production)
 ↑
staging (pré-production)
 ↑
develop (développement)
 ↑
feature/* (fonctionnalités)
```

### Workflow Recommandé :

1. **Développement de fonctionnalité :**
   ```bash
   git checkout -b feature/nouvelle-fonctionnalite
   # Développement...
   git push origin feature/nouvelle-fonctionnalite
   # Créer PR vers develop
   ```

2. **Intégration en développement :**
   ```bash
   # Merge de la PR dans develop
   # → Déclenche pipeline de développement
   ```

3. **Déploiement en staging :**
   ```bash
   git checkout staging
   git merge develop
   git push origin staging
   # → Déclenche pipeline staging + déploiement
   ```

4. **Déploiement en production :**
   ```bash
   git checkout main
   git merge staging
   git push origin main
   # → Déclenche pipeline production + déploiement
   ```

---

*Dernière mise à jour : Janvier 2025*
