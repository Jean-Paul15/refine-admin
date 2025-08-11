# 📊 Fonctionnalité d'Export Newsletter

## Nouvelle Fonctionnalité Ajoutée

### 🎯 Export des Abonnés Newsletter

Vous pouvez maintenant exporter la liste des abonnés newsletter en deux formats :

#### 📋 **Export Excel (.xlsx)**
- Format professionnel avec toutes les colonnes
- Inclut : ID, Email, Statut, Date d'inscription, Nom, Prénom, etc.
- Formatage automatique des dates
- Nom de fichier : `abonnes_newsletter_YYYY-MM-DD.xlsx`

#### 📄 **Export CSV (.csv)**
- Format compatible avec tous les tableurs
- Même contenu que l'Excel
- Encodage UTF-8 avec BOM pour les caractères spéciaux
- Nom de fichier : `abonnes_newsletter_YYYY-MM-DD.csv`

### 🔍 **Comment utiliser :**

1. **Accédez à la liste des abonnés** : Menu `Newsletter` → `Liste`
2. **Cliquez sur les boutons d'export** en haut à droite de la liste
3. **Choisissez votre format** :
   - **Export Excel** : Pour un rapport professionnel
   - **Export CSV** : Pour l'import dans d'autres systèmes

### 📈 **Données Exportées :**

- **ID** : Identifiant unique de l'abonné
- **Email** : Adresse email de l'abonné
- **Statut** : Actif / Inactif
- **Date d'inscription** : Date et heure d'inscription
- **Nom** : Nom de famille (si disponible)
- **Prénom** : Prénom (si disponible)
- **Téléphone** : Numéro de téléphone (si disponible)
- **Adresse** : Adresse postale (si disponible)
- **Ville** : Ville (si disponible)
- **Code postal** : Code postal (si disponible)
- **Dernière modification** : Date de dernière mise à jour

### 🛠️ **Fonctionnalités Techniques :**

- **Filtrage automatique** : Seuls les abonnés visibles sont exportés
- **Formatage des dates** : Format français DD/MM/YYYY HH:mm
- **Statut lisible** : "Actif" / "Inactif" au lieu de true/false
- **Gestion des erreurs** : Messages d'erreur en cas de problème
- **Indicateur de chargement** : Boutons avec état de chargement

### 📱 **Interface Utilisateur :**

Les boutons d'export sont situés dans la barre d'outils de la liste des abonnés :
- **Bouton Excel** : Icône Excel + "Export Excel"
- **Bouton CSV** : Icône téléchargement + "Export CSV"
- **État de chargement** : Les boutons montrent un spinner pendant l'export

---

Cette fonctionnalité facilite le suivi et l'analyse des abonnés newsletter pour l'équipe de la Maison de Charlotte.
