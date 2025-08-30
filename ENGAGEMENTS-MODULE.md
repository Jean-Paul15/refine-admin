# Module Engagements - Documentation

## Fonctionnalités Implémentées

### 1. Base de Données

**Fichier SQL:** `engagements-setup.sql`

- **Table `public.engagements`** avec les colonnes :
  - `id` (UUID, clé primaire)
  - `title` (VARCHAR(255), titre de l'engagement)
  - `description` (TEXT, description détaillée)
  - `image_url` (TEXT, URL de l'image)
  - `ordre` (INTEGER, ordre d'affichage automatique)
  - `is_active` (BOOLEAN, statut d'activation)
  - `created_at` (TIMESTAMP, date de création)
  - `updated_at` (TIMESTAMP, date de mise à jour)

### 2. Système d'Ordre Automatique

**Fonctionnalités avancées :**

- **Ordre automatique basé sur la date de création** (A → Z chronologique)
- **Fonction `calculate_engagement_ordre()`** : calcule l'ordre d'un engagement
- **Fonction `reorganize_all_engagements_ordre()`** : réorganise tous les ordres
- **Trigger automatique** : met à jour l'ordre à chaque insertion/modification
- **Fonction utilitaire `reorder_engagements()`** : pour réorganisation manuelle

**Logique :**
- Plus ancien = ordre plus petit = affiché en premier
- Nouveau engagement = inséré automatiquement selon sa date
- Modification de date = recalcul automatique de l'ordre

### 3. Pages CRUD Complètes

#### **Liste (`src/pages/engagements/list.tsx`)**
- Tableau avec colonnes : Ordre, Image, Titre, Description, Statut, Date, Actions
- Switch interactif pour activer/désactiver les engagements
- Tri par ordre d'affichage par défaut
- Aperçu d'images avec fallback
- Actions : Éditer, Voir, Supprimer

#### **Création (`src/pages/engagements/create.tsx`)**
- Formulaire complet avec validation
- Upload d'image vers Supabase Storage (`uploads/engagements/`)
- Éditeur Markdown pour la description
- Switch pour le statut d'activation (actif par défaut)
- Gestion automatique de l'ordre (pas de saisie manuelle)

#### **Édition (`src/pages/engagements/edit.tsx`)**
- Formulaire pré-rempli avec les données existantes
- Gestion de remplacement d'image (suppression automatique de l'ancienne)
- Affichage de l'ordre actuel (lecture seule)
- Même fonctionnalités que la création

#### **Visualisation (`src/pages/engagements/show.tsx`)**
- Affichage complet avec mise en page soignée
- Image en grand format
- Rendu Markdown de la description
- Informations techniques (ordre, dates, ID)
- Indicateurs de statut

### 4. Intégration dans l'Application

**Modifications dans `src/App.tsx` :**
- Import des composants Engagement
- Nouvelle ressource "engagements" avec icône `TeamOutlined`
- Routes complètes : `/engagements`, `/engagements/create`, etc.
- Navigation dans le menu latéral

### 5. Données d'Exemple

**Engagements pré-configurés :**
1. "APPORTER UNE PRÉSENCE"
2. "ACTIVITÉS COLLECTIVES" 
3. "AGIR CONTRE LES VULNÉRABILITÉS"
4. "SENSIBILISER LA SOCIÉTÉ"

## Utilisation

### Pour les Administrateurs

1. **Accéder au module :** Menu "Engagements" dans l'interface admin
2. **Ajouter un engagement :** Bouton "Créer" → Remplir le formulaire
3. **Modifier l'ordre :** L'ordre se calcule automatiquement selon la date de création
4. **Gérer le statut :** Switch direct depuis la liste ou dans l'édition

### Pour les Développeurs

#### Réorganiser manuellement les ordres :
```sql
SELECT reorder_engagements();
```

#### Vérifier l'ordre actuel :
```sql
SELECT id, title, ordre, created_at 
FROM public.engagements 
ORDER BY ordre ASC;
```

#### Calculer l'ordre d'un engagement spécifique :
```sql
SELECT calculate_engagement_ordre('uuid-de-engagement');
```

## Architecture Technique

### Composants React
- **EngagementList** : Liste avec tableau Ant Design
- **EngagementCreate/Edit** : Formulaires avec upload et Markdown
- **EngagementShow** : Affichage détaillé

### Fonctionnalités Avancées
- **Upload sécurisé** vers Supabase Storage
- **Gestion automatique de l'ordre** via triggers PostgreSQL
- **Interface réactive** avec switch temps réel pour le statut
- **Validation de formulaire** complète
- **Prévisualisation d'images** avec fallback

### Base de Données
- **Indexes optimisés** pour les performances
- **Triggers automatiques** pour updated_at et ordre
- **Contraintes** et validations
- **Commentaires** sur toutes les colonnes

## Points Forts

1. **Ordre entièrement automatique** - Aucune gestion manuelle nécessaire
2. **Interface intuitive** - Switch pour activer/désactiver directement
3. **Upload d'images robuste** - Avec suppression automatique des anciennes
4. **Système extensible** - Facile d'ajouter de nouveaux champs
5. **Performance optimisée** - Indexes sur les colonnes importantes

## Configuration Requise

- PostgreSQL avec support UUID
- Supabase Storage configuré
- Bucket "uploads" avec dossier "engagements"
- Permissions appropriées pour l'upload

## Prochaines Étapes Possibles

1. **Drag & Drop** pour réorganiser manuellement l'ordre
2. **Catégories** d'engagements
3. **Images multiples** par engagement
4. **Traductions** multilingues
5. **API publique** pour affichage sur le site web
