# Résolution de l'erreur "function unaccent does not exist"

## 🚨 Problème
Lors de la mise à jour d'un article, vous obtenez l'erreur :
```
function unaccent(text) does not exist
Error when updating article (status code: 42883)
```

## 🔍 Cause
Cette erreur indique qu'un trigger ou une fonction dans votre base de données Supabase utilise la fonction `unaccent` de PostgreSQL, mais que l'extension correspondante n'est pas activée.

## ✅ Solutions

### Solution 1 : Activer l'extension unaccent (recommandée)

1. **Connectez-vous à votre dashboard Supabase**
2. **Allez dans l'éditeur SQL** (SQL Editor)
3. **Exécutez le script** `fix-unaccent-function.sql` :

```sql
-- Activer l'extension unaccent
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Créer les fonctions de normalisation
CREATE OR REPLACE FUNCTION normalize_text(text)
RETURNS text AS $$
BEGIN
    RETURN lower(unaccent($1));
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### Solution 2 : Fonction de remplacement (si extension non disponible)

Si l'extension `unaccent` n'est pas disponible sur votre instance Supabase, utilisez le script `fix-unaccent-manual.sql` :

```sql
-- Fonction de remplacement manuelle
CREATE OR REPLACE FUNCTION unaccent(text)
RETURNS text AS $$
BEGIN
    RETURN translate($1,
        'àáâãäåąăćčđèéêëęğìíîïłńňòóôõöőøšșțùúûüűýÿžź',
        'aaaaaaaaaccdeeeeegiiiiłnnooooooosssttuuuuuyyzz'
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

## 📋 Étapes détaillées

### Étape 1 : Diagnostiquer le problème
```sql
-- Vérifier si l'extension existe
SELECT * FROM pg_extension WHERE extname = 'unaccent';

-- Vérifier les fonctions qui utilisent unaccent
SELECT routine_name, routine_definition 
FROM information_schema.routines 
WHERE routine_definition ILIKE '%unaccent%';
```

### Étape 2 : Appliquer la solution
1. Copiez le contenu de `fix-unaccent-function.sql`
2. Collez-le dans l'éditeur SQL de Supabase
3. Exécutez le script
4. Vérifiez qu'il n'y a pas d'erreurs

### Étape 3 : Tester la correction
1. Retournez dans votre application
2. Essayez de modifier un article
3. La sauvegarde devrait maintenant fonctionner

## 🔧 Si le problème persiste

### Vérifier les triggers existants
```sql
-- Lister tous les triggers sur la table articles
SELECT event_object_table, trigger_name, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'articles';
```

### Supprimer un trigger problématique (si nécessaire)
```sql
-- Remplacez 'nom_du_trigger' par le nom réel
DROP TRIGGER IF EXISTS nom_du_trigger ON articles;
```

## 📁 Fichiers fournis

- `fix-unaccent-function.sql` : Solution complète avec extension
- `fix-unaccent-manual.sql` : Solution de remplacement manuelle

## ⚠️ Notes importantes

1. **Sauvegarde** : Toujours sauvegarder votre base de données avant d'appliquer des modifications
2. **Test** : Testez sur un environnement de développement en premier
3. **Performance** : La fonction manuelle peut être moins performante que l'extension native

## 🎯 Résultat attendu

Après avoir appliqué la solution :
- ✅ Les articles peuvent être modifiés sans erreur
- ✅ La fonction `unaccent` est disponible
- ✅ Les fonctionnalités de recherche fonctionnent correctement

Si vous continuez à avoir des problèmes, vérifiez les logs de Supabase pour identifier le trigger ou la fonction spécifique qui cause l'erreur.
