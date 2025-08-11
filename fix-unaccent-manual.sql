-- Solution alternative si l'extension unaccent n'est pas disponible
-- À exécuter dans l'éditeur SQL de Supabase si l'extension unaccent ne peut pas être activée

-- Créer une fonction de remplacement pour unaccent
CREATE OR REPLACE FUNCTION unaccent(text)
RETURNS text AS $$
BEGIN
    -- Remplacer les caractères accentués manuellement
    RETURN translate($1,
        'àáâãäåąăćčđèéêëęğìíîïłńňòóôõöőøšșțùúûüűýÿžź',
        'aaaaaaaaaccdeeeeegiiiiłnnooooooosssttuuuuuyyzz'
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Créer aussi la version pour les majuscules
CREATE OR REPLACE FUNCTION unaccent_upper(text)
RETURNS text AS $$
BEGIN
    RETURN translate(upper($1),
        'ÀÁÂÃÄÅĄĂĆČĐÈÉÊËĘĞÌÍÎÏŁŃŇÒÓÔÕÖŐØŠȘȚÙÚÛÜŰÝŸŽŹ',
        'AAAAAAAAACCDEEEEEGIIIIŁNNOOOOOOOSSSTTUUUUUYYZZ'
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction de normalisation de texte pour la recherche
CREATE OR REPLACE FUNCTION normalize_text(text)
RETURNS text AS $$
BEGIN
    -- Convertir en minuscules et supprimer les accents
    RETURN lower(unaccent($1));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Vérification que la fonction fonctionne
DO $$
DECLARE
    test_result text;
BEGIN
    test_result := unaccent('Café français avec accents éèà');
    RAISE NOTICE 'Test unaccent: % -> %', 'Café français avec accents éèà', test_result;
    
    IF test_result = 'Cafe francais avec accents eea' THEN
        RAISE NOTICE 'SUCCESS: Fonction unaccent créée avec succès!';
    ELSE
        RAISE NOTICE 'WARNING: La fonction unaccent pourrait ne pas fonctionner correctement';
    END IF;
END
$$;
