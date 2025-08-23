# PME Manager - Application de Gestion d'Entreprise

Une application complète de gestion pour les PME avec authentification multi-entreprises, gestion des utilisateurs et des rôles, et intégration Supabase.

## 🚀 Fonctionnalités

### 🔐 Authentification et Gestion des Entreprises
- **Inscription d'entreprise** : Création de compte avec informations complètes de l'entreprise
- **Authentification Google** : Connexion rapide avec Google OAuth
- **Gestion multi-utilisateurs** : Système de rôles et permissions granulaires
- **Sécurité avancée** : Authentification sécurisée avec Supabase

### 👥 Gestion des Utilisateurs
- **Rôles hiérarchiques** : Propriétaire, Administrateur, Manager, Employé
- **Permissions personnalisables** : Contrôle d'accès par module
- **Invitations d'équipe** : Système d'invitation par email
- **Gestion des statuts** : Activation/désactivation des comptes

### 📊 Modules de Gestion
- **Tableau de bord** : Vue d'ensemble avec métriques clés
- **Gestion des ventes** : Suivi des commandes et paiements
- **Gestion des clients** : CRM intégré avec programme de fidélité
- **Gestion des stocks** : Inventaire en temps réel avec alertes
- **Production** : Planification et suivi de production
- **Finances** : Comptabilité et rapports financiers
- **Journal d'entreprise** : Suivi des activités et réflexions

### ⚙️ Paramètres Avancés
- **Informations d'entreprise** : Profil complet avec logo et coordonnées
- **Gestion des utilisateurs** : Interface d'administration complète
- **Sécurité** : Paramètres de sécurité et sessions
- **Notifications** : Configuration des alertes
- **Apparence** : Personnalisation de l'interface
- **Données** : Sauvegarde et gestion des données

## 🛠️ Technologies

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS + Lucide Icons
- **Backend** : Supabase (PostgreSQL + Auth + Storage)
- **Authentification** : Supabase Auth + Google OAuth
- **Base de données** : PostgreSQL avec Row Level Security (RLS)
- **Déploiement** : Compatible Vercel, Netlify, etc.

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Supabase

### Configuration

1. **Cloner le projet**
```bash
git clone <repository-url>
cd project
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Supabase**
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env avec vos clés Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. **Configurer la base de données**
```bash
# Exécuter les migrations dans l'ordre
# 1. Migrations existantes (déjà présentes)
# 2. Migration des entreprises et utilisateurs
```

5. **Configurer Google OAuth (optionnel)**
- Aller dans le dashboard Supabase > Authentication > Providers
- Activer Google et configurer les clés OAuth

### Démarrage

```bash
# Mode développement
npm run dev

# Build de production
npm run build

# Aperçu de production
npm run preview
```

## 🗄️ Structure de la Base de Données

### Tables Principales

#### `companies`
- Informations des entreprises
- Abonnements et statuts
- Données de contact et légales

#### `users`
- Utilisateurs liés aux entreprises
- Rôles et permissions
- Statuts d'activation

#### Tables Métier
- `clients` : Gestion des clients
- `products` : Catalogue produits
- `sales` : Transactions de vente
- `finance` : Opérations financières
- `journal` : Entrées de journal
- `production_*` : Modules de production
- `suppliers_*` : Gestion fournisseurs

### Sécurité (RLS)
- Isolation des données par entreprise
- Contrôle d'accès basé sur les rôles
- Politiques de sécurité granulaires

## 👤 Système de Rôles

### Propriétaire (Owner)
- Accès complet à toutes les fonctionnalités
- Gestion des utilisateurs et permissions
- Configuration de l'entreprise

### Administrateur (Admin)
- Accès à la plupart des modules
- Gestion des utilisateurs (sauf propriétaire)
- Rapports et paramètres

### Manager
- Gestion opérationnelle
- Accès aux ventes, stock, production
- Rapports limités

### Employé (Employee)
- Accès de base aux ventes et clients
- Fonctionnalités limitées selon permissions

## 🔧 Configuration Avancée

### Variables d'Environnement
```env
# Supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# Application
VITE_APP_NAME="PME Manager"
VITE_APP_VERSION="1.0.0"
NODE_ENV=development
```

### Personnalisation
- Thèmes et couleurs dans `tailwind.config.js`
- Configuration des modules dans `src/types/index.ts`
- Permissions personnalisées dans `UserPermissions`

## 📱 Fonctionnalités Mobiles
- Interface responsive
- Navigation mobile optimisée
- Sidebar collapsible
- Touch-friendly

## 🔒 Sécurité

### Authentification
- Mots de passe sécurisés avec validation
- Authentification à deux facteurs (2FA) prête
- Sessions sécurisées avec Supabase

### Protection des Données
- Chiffrement en transit et au repos
- Isolation des données par entreprise
- Audit trail des modifications

### Conformité
- RGPD ready
- Sauvegarde et export des données
- Suppression sécurisée des comptes

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
vercel

# Configuration des variables d'environnement dans le dashboard Vercel
```

### Netlify
```bash
# Build
npm run build

# Déployer le dossier dist/
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Documentation** : Consultez ce README et les commentaires dans le code
- **Issues** : Utilisez les GitHub Issues pour signaler des bugs
- **Discussions** : GitHub Discussions pour les questions générales

## 🗺️ Roadmap

### Version 1.1
- [ ] Notifications push
- [ ] API REST complète
- [ ] Module de facturation avancé
- [ ] Rapports personnalisables

### Version 1.2
- [ ] Application mobile (React Native)
- [ ] Intégrations tierces (comptabilité, CRM)
- [ ] IA pour recommandations business
- [ ] Mode hors ligne

### Version 2.0
- [ ] Multi-devises
- [ ] Multi-langues
- [ ] Marketplace d'extensions
- [ ] Analytics avancés

---

**PME Manager** - Simplifiez la gestion de votre entreprise avec une solution moderne et sécurisée.
