# Refine Admin - Système de gestion de contenu

Application d'administration construite avec Refine.dev et Supabase pour gérer :

- **Profils utilisateurs** : Gestion des utilisateurs avec rôles (admin, editor, user)
- **Articles** : Système de blog avec éditeur riche, gestion des auteurs et publication
- **Actions** : Gestion des actions/événements avec types (carrousel, principale, passée)
- **Abonnés Newsletter** : Gestion des abonnements à la newsletter
- **Paramètres** : Configuration de l'application (téléphone, adresse, réseaux sociaux, etc.)
- **Catégories et Blog Posts** : Système existant conservé

## Configuration

### 1. Base de données Supabase

1. Créez un nouveau projet sur [Supabase](https://supabase.com)
2. Exécutez le script SQL fourni dans `database-setup.sql` dans l'éditeur SQL de Supabase
3. Configurez les variables d'environnement :

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANNON_KEY=your_supabase_anon_key
```

### 2. Installation

```bash
npm install
```

### 3. Démarrage

```bash
npm run dev
```

## Structure des données

### Profils
- `id` : UUID (référence auth.users)
- `email` : Email unique
- `first_name` : Prénom
- `last_name` : Nom
- `role` : Rôle (user, admin, editor)

### Articles
- `title` : Titre de l'article
- `slug` : URL slug unique
- `image_url` : URL de l'image
- `published_date` : Date de publication
- `short_description` : Description courte
- `content` : Contenu complet
- `author_id` : Référence vers profiles
- `is_published` : Statut de publication

### Actions
- `title` : Titre de l'action
- `slug` : URL slug unique
- `image_url` : URL de l'image
- `description` : Description
- `full_content` : Contenu complet
- `type` : Type (carrousel, principale, passée)
- `is_active` : Statut actif

### Newsletter Subscribers
- `email` : Email de l'abonné
- `subscribed_at` : Date d'abonnement
- `is_active` : Statut actif

### Settings
- `key` : Clé du paramètre (ex: phone, address, facebook_url)
- `value` : Valeur du paramètre
- `description` : Description optionnelle

## Fonctionnalités

- ✅ Authentification avec Supabase Auth
- ✅ CRUD complet pour toutes les entités
- ✅ Interface utilisateur avec Ant Design
- ✅ Gestion des rôles et permissions
- ✅ Recherche et filtrage
- ✅ Pagination
- ✅ Validation des formulaires
- ✅ Politique de sécurité RLS (Row Level Security)

## Technologies utilisées

- **Frontend** : React 18, TypeScript, Vite
- **Framework** : Refine.dev
- **UI** : Ant Design
- **Backend** : Supabase (PostgreSQL, Auth, API)
- **Routing** : React Router 7

## Getting Started

A React Framework for building internal tools, admin panels, dashboards & B2B apps with unmatched flexibility ✨

Refine's hooks and components simplifies the development process and eliminates the repetitive tasks by providing industry-standard solutions for crucial aspects of a project, including authentication, access control, routing, networking, state management, and i18n.

## Available Scripts

### Running the development server.

```bash
    npm run dev
```

### Building for production.

```bash
    npm run build
```

### Running the production server.

```bash
    npm run start
```

## Learn More

To learn more about **Refine**, please check out the [Documentation](https://refine.dev/docs)

- **Supabase Data Provider** [Docs](https://refine.dev/docs/core/providers/data-provider/#overview)
- **Ant Design** [Docs](https://refine.dev/docs/ui-frameworks/antd/tutorial/)
- **React Router** [Docs](https://refine.dev/docs/core/providers/router-provider/)

## License

MIT
