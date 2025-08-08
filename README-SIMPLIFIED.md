# Refine Admin - Version Simplifiée

Interface d'administration moderne construite avec Refine.dev et Supabase, optimisée pour 5 tables essentielles.

## 🎯 **Structure de données simplifiée**

### Tables gérées :
1. **`profiles`** - Profils utilisateurs (liés à auth.users)
2. **`newsletter_subscribers`** - Abonnés newsletter 
3. **`articles`** - Articles avec éditeur WYSIWYG
4. **`actions`** - Actions/événements du site
5. **`settings`** - Paramètres de configuration

## 🚀 **Fonctionnalités**

### ✅ **CRUD complet** pour chaque table :
- **Création** avec formulaires validés
- **Lecture** avec listes paginées et recherche
- **Modification** avec éditeur WYSIWYG pour le contenu
- **Suppression** avec confirmation

### ✅ **Dashboard intelligent** :
- Statistiques en temps réel pour chaque table
- Actions rapides pour créer du contenu
- Interface responsive et moderne

### ✅ **Éditeur WYSIWYG** :
- Intégré pour le contenu des articles
- Support Markdown complet
- Prévisualisation en temps réel
- Interface intuitive

### ✅ **Fonctionnalités avancées** :
- Mode hors ligne avec cache local
- Notifications temps réel
- Thèmes clair/sombre
- Export CSV des données
- Upload de fichiers (images)

## 🐳 **Déploiement Docker**

### Construction rapide :
```powershell
.\docker-build-simple.ps1
```

### Lancement :
```bash
docker run -p 3000:3000 -d --name refine-admin-app refine-admin:latest
```

### Accès :
- **Application** : http://localhost:3000
- **Login** : info@refine.dev / refine-supabase

## 📊 **Base de données Supabase**

### Configuration SQL :
Exécutez le fichier `database-setup-simplified.sql` dans votre console SQL Supabase.

### Variables d'environnement :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANNON_KEY=votre_clé_anonyme
```

## 🗂️ **Structure des tables**

### `profiles`
- Profils utilisateurs avec rôles (user, admin, editor)
- Liaison avec l'authentification Supabase

### `newsletter_subscribers`
- Gestion des abonnés newsletter
- Statut actif/inactif

### `articles`
- Articles avec contenu riche (WYSIWYG)
- Statut publié/brouillon
- Auteur lié aux profils

### `actions`
- Actions/événements du site
- Types configurables (carrousel, principale, passée)
- Contenu riche avec description et contenu complet

### `settings`
- Paramètres clé/valeur du site
- Configuration centralisée
- Documentation optionnelle

## 🛠️ **Technologies utilisées**

- **Frontend** : React 18, TypeScript, Vite
- **Framework** : Refine.dev v4.47.1
- **UI** : Ant Design
- **Base de données** : Supabase (PostgreSQL)
- **Éditeur** : @uiw/react-md-editor
- **Déploiement** : Docker (Alpine Linux)

## 📱 **Interface**

- **Responsive** : Optimisé mobile/tablette/desktop
- **Navigation** : Menu latéral avec icônes
- **Thèmes** : Clair/sombre avec persistance
- **Performance** : Cache local et optimisations

## 🔐 **Sécurité**

- **RLS (Row Level Security)** activé sur toutes les tables
- **Authentification** Supabase intégrée
- **Policies** configurées pour chaque table
- **Validation** côté client et serveur

---

**Version** : 2.0 Simplifiée (7 août 2025)  
**Auteur** : GitHub Copilot Assistant  
**License** : MIT
