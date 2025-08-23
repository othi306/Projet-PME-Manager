# 🚀 Guide de Déploiement - PME Manager

Ce guide vous explique comment publier votre application PME Manager sur différentes plateformes.

## 📋 Prérequis

1. **Compte Supabase configuré** avec :
   - Projet créé
   - Base de données configurée avec les migrations
   - Variables d'environnement notées

2. **Code source prêt** :
   - Toutes les fonctionnalités testées localement
   - Variables d'environnement configurées

## 🌐 Option 1 : Déploiement sur Vercel (Recommandé)

### Étape 1 : Préparation
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login
```

### Étape 2 : Configuration
```bash
# Dans le dossier de votre projet
vercel

# Suivre les instructions :
# - Set up and deploy? Y
# - Which scope? (votre compte)
# - Link to existing project? N
# - Project name? pme-manager (ou votre choix)
# - Directory? ./
# - Override settings? N
```

### Étape 3 : Variables d'environnement
```bash
# Ajouter les variables Supabase
vercel env add VITE_SUPABASE_URL
# Coller votre URL Supabase

vercel env add VITE_SUPABASE_ANON_KEY
# Coller votre clé anonyme Supabase
```

### Étape 4 : Déploiement
```bash
# Déployer en production
vercel --prod
```

**✅ Votre app sera disponible sur : `https://votre-projet.vercel.app`**

---

## 🔷 Option 2 : Déploiement sur Netlify

### Étape 1 : Via Git (Recommandé)
1. **Pousser votre code sur GitHub/GitLab**
2. **Aller sur [netlify.com](https://netlify.com)**
3. **"New site from Git"**
4. **Connecter votre repository**
5. **Configuration automatique** (grâce au fichier `netlify.toml`)

### Étape 2 : Variables d'environnement
Dans le dashboard Netlify :
1. **Site settings > Environment variables**
2. **Ajouter :**
   - `VITE_SUPABASE_URL` = votre URL Supabase
   - `VITE_SUPABASE_ANON_KEY` = votre clé anonyme

### Étape 3 : Déploiement
- **Automatique** à chaque push sur la branche principale
- **Manuel** : "Trigger deploy" dans le dashboard

**✅ Votre app sera disponible sur : `https://votre-site.netlify.app`**

---

## ☁️ Option 3 : Déploiement sur Firebase Hosting

### Étape 1 : Installation
```bash
npm install -g firebase-tools
firebase login
```

### Étape 2 : Initialisation
```bash
firebase init hosting

# Configuration :
# - Use existing project ou Create new project
# - Public directory: dist
# - Single-page app: Yes
# - Overwrite index.html: No
```

### Étape 3 : Build et déploiement
```bash
# Build de production
npm run build

# Déployer
firebase deploy
```

**✅ Votre app sera disponible sur : `https://votre-projet.web.app`**

---

## 🐳 Option 4 : Déploiement avec Docker

### Étape 1 : Créer le Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Étape 2 : Configuration Nginx
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### Étape 3 : Build et run
```bash
# Build l'image
docker build -t pme-manager .

# Run le container
docker run -p 80:80 pme-manager
```

---

## 🔧 Configuration Post-Déploiement

### 1. Configuration Supabase
Dans votre dashboard Supabase :
1. **Authentication > URL Configuration**
2. **Ajouter votre domaine de production** :
   - Site URL : `https://votre-domaine.com`
   - Redirect URLs : `https://votre-domaine.com/**`

### 2. Google OAuth (si utilisé)
1. **Google Cloud Console**
2. **APIs & Services > Credentials**
3. **Ajouter votre domaine** dans "Authorized JavaScript origins"
4. **Mettre à jour** dans Supabase > Authentication > Providers > Google

### 3. Domaine personnalisé (optionnel)
- **Vercel** : Project Settings > Domains
- **Netlify** : Site Settings > Domain management
- **Firebase** : Hosting > Add custom domain

---

## 🔍 Vérification du Déploiement

### Checklist post-déploiement :
- [ ] ✅ Site accessible via HTTPS
- [ ] ✅ Authentification fonctionne
- [ ] ✅ Google OAuth fonctionne (si configuré)
- [ ] ✅ Base de données connectée
- [ ] ✅ Toutes les pages se chargent
- [ ] ✅ Responsive design fonctionne
- [ ] ✅ Pas d'erreurs dans la console

### Tests à effectuer :
1. **Inscription d'une nouvelle entreprise**
2. **Connexion avec Google**
3. **Navigation entre les modules**
4. **Gestion des utilisateurs**
5. **Paramètres d'entreprise**

---

## 🚨 Dépannage

### Erreurs communes :

**1. Variables d'environnement manquantes**
```
Error: Missing Supabase environment variables
```
**Solution :** Vérifier que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont configurées

**2. Erreur de routing (404 sur refresh)**
**Solution :** Vérifier la configuration des redirections (`vercel.json`, `netlify.toml`)

**3. Erreur CORS avec Supabase**
**Solution :** Ajouter votre domaine dans la configuration Supabase

**4. Google OAuth ne fonctionne pas**
**Solution :** Vérifier les domaines autorisés dans Google Cloud Console

---

## 📊 Monitoring et Analytics

### Recommandations :
1. **Vercel Analytics** (pour Vercel)
2. **Netlify Analytics** (pour Netlify)
3. **Google Analytics** (universel)
4. **Sentry** (monitoring d'erreurs)

### Configuration Sentry (optionnel) :
```bash
npm install @sentry/react @sentry/tracing
```

---

## 🔄 Mise à jour continue

### Workflow recommandé :
1. **Développement local**
2. **Tests complets**
3. **Push sur Git**
4. **Déploiement automatique**
5. **Tests en production**

### Branches recommandées :
- `main` → Production
- `staging` → Tests
- `develop` → Développement

---

**🎉 Félicitations ! Votre application PME Manager est maintenant en ligne !**

Pour toute question, consultez la documentation de la plateforme choisie ou créez une issue sur le repository.
