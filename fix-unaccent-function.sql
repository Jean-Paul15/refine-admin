-- Script pour résoudre l'erreur "function unaccent does not exist"
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Activer l'extension unaccent si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2. Vérifier si l'extension est bien installée
SELECT * FROM pg_extension WHERE extname = 'unaccent';

-- 3. Créer une fonction de normalisation de texte pour la recherche si nécessaire
CREATE OR REPLACE FUNCTION normalize_text(text)
RETURNS text AS $$
BEGIN
    -- Convertir en minuscules et supprimer les accents
    RETURN lower(unaccent($1));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Si vous avez des triggers qui utilisent unaccent, voici un exemple de correction :
-- (Remplacez par votre vrai trigger si nécessaire)

-- Exemple de fonction pour mettre à jour un champ de recherche normalisé
CREATE OR REPLACE FUNCTION update_search_field()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour un champ de recherche normalisé si il existe
    IF TG_TABLE_NAME = 'articles' THEN
        -- Si vous avez un champ search_field dans la table articles
        IF column_exists('articles', 'search_field') THEN
            NEW.search_field := normalize_text(NEW.title || ' ' || COALESCE(NEW.content, ''));
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction utilitaire pour vérifier si une colonne existe
CREATE OR REPLACE FUNCTION column_exists(table_name text, column_name text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = $1 
        AND column_name = $2
    );
END;
$$ LANGUAGE plpgsql;

-- 5. Mettre à jour la fonction de recherche d'articles si elle existe
-- (Cette partie peut être adaptée selon vos besoins de recherche)

CREATE OR REPLACE FUNCTION search_articles(search_term text)
RETURNS SETOF articles AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM articles
    WHERE 
        is_published = true
        AND (
            normalize_text(title) ILIKE '%' || normalize_text(search_term) || '%'
            OR normalize_text(short_description) ILIKE '%' || normalize_text(search_term) || '%'
            OR normalize_text(content) ILIKE '%' || normalize_text(search_term) || '%'
        )
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Extension unaccent activée et fonctions de recherche créées avec succès!';
END
$$;
