-- ===========================================
-- CRÉATION DE LA TABLE ENGAGEMENTS
-- ===========================================

-- Créer la table engagements
CREATE TABLE IF NOT EXISTS public.engagements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    ordre INTEGER DEFAULT 0, -- Pour définir l'ordre d'affichage
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- INDEX POUR OPTIMISER LES PERFORMANCES
-- ===========================================

-- Index pour les recherches par statut d'activité et ordre
CREATE INDEX IF NOT EXISTS idx_engagements_active_ordre ON public.engagements (is_active, ordre ASC) WHERE is_active = true;

-- Index pour les recherches par titre
CREATE INDEX IF NOT EXISTS idx_engagements_title ON public.engagements (title);

-- Index pour les timestamps
CREATE INDEX IF NOT EXISTS idx_engagements_created_at ON public.engagements (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_engagements_updated_at ON public.engagements (updated_at DESC);

-- ===========================================
-- FONCTIONS POUR LA GESTION AUTOMATIQUE DE L'ORDRE
-- ===========================================

-- Fonction pour calculer l'ordre automatique basé sur la date
CREATE OR REPLACE FUNCTION calculate_engagement_ordre(engagement_id UUID DEFAULT NULL)
RETURNS INTEGER AS $$
DECLARE
    target_created_at TIMESTAMP WITH TIME ZONE;
    calculated_ordre INTEGER;
BEGIN
    -- Si c'est pour un engagement existant, récupérer sa date
    IF engagement_id IS NOT NULL THEN
        SELECT created_at INTO target_created_at 
        FROM public.engagements 
        WHERE id = engagement_id;
    ELSE
        -- Pour un nouvel engagement, utiliser la date actuelle
        target_created_at := NOW();
    END IF;
    
    -- Calculer l'ordre en comptant les engagements créés avant cette date
    SELECT COALESCE(COUNT(*), 0) + 1 INTO calculated_ordre
    FROM public.engagements 
    WHERE created_at < target_created_at
    AND (engagement_id IS NULL OR id != engagement_id);
    
    RETURN calculated_ordre;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour réorganiser tous les ordres automatiquement
CREATE OR REPLACE FUNCTION reorganize_all_engagements_ordre()
RETURNS VOID AS $$
DECLARE
    eng_record RECORD;
    new_ordre INTEGER := 1;
BEGIN
    -- Parcourir tous les engagements par ordre de création (A à Z chronologique)
    FOR eng_record IN 
        SELECT id 
        FROM public.engagements 
        ORDER BY created_at ASC
    LOOP
        -- Mettre à jour l'ordre
        UPDATE public.engagements 
        SET ordre = new_ordre 
        WHERE id = eng_record.id;
        
        new_ordre := new_ordre + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- TRIGGER POUR UPDATED_AT
-- ===========================================

-- Créer la fonction pour mettre à jour updated_at si elle n'existe pas
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_engagements_updated_at ON public.engagements;
CREATE TRIGGER update_engagements_updated_at 
    BEFORE UPDATE ON public.engagements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- TRIGGER POUR ORDRE AUTOMATIQUE
-- ===========================================

-- Fonction trigger pour gérer l'ordre automatiquement
CREATE OR REPLACE FUNCTION handle_engagement_ordre()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Pour un nouvel engagement, calculer l'ordre automatiquement
        NEW.ordre := calculate_engagement_ordre();
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Si la date de création change, recalculer l'ordre
        IF OLD.created_at != NEW.created_at THEN
            NEW.ordre := calculate_engagement_ordre(NEW.id);
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour ordre automatique à l'insertion
DROP TRIGGER IF EXISTS auto_engagement_ordre ON public.engagements;
CREATE TRIGGER auto_engagement_ordre
    BEFORE INSERT OR UPDATE ON public.engagements
    FOR EACH ROW
    EXECUTE FUNCTION handle_engagement_ordre();

-- ===========================================
-- DONNÉES D'EXEMPLE
-- ===========================================

-- Insérer les données d'exemple (reprendre le contenu actuel)
INSERT INTO public.engagements (title, description, image_url, is_active) VALUES 
(
    'APPORTER UNE PRÉSENCE',
    'Créer des relations de confiance avec les personnes âgées isolées, même en milieu rural.',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    true
),
(
    'ACTIVITÉS COLLECTIVES',
    'Organiser des moments de partage et de joie entre les générations.',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    true
),
(
    'AGIR CONTRE LES VULNÉRABILITÉS',
    'Accompagner face aux difficultés liées à l''âge ou à la précarité.',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
    true
),
(
    'SENSIBILISER LA SOCIÉTÉ',
    'Faire évoluer le regard de la société sur le vieillissement.',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    true
);

-- Réorganiser les ordres automatiquement après insertion
SELECT reorganize_all_engagements_ordre();

-- Vérifier les données insérées
SELECT id, title, description, ordre, is_active, created_at 
FROM public.engagements 
ORDER BY ordre ASC;

-- ===========================================
-- COMMENTAIRES SUR LA TABLE
-- ===========================================

COMMENT ON TABLE public.engagements IS 'Table des engagements de l''association affichés sur la page d''accueil';
COMMENT ON COLUMN public.engagements.title IS 'Titre de l''engagement';
COMMENT ON COLUMN public.engagements.description IS 'Description détaillée de l''engagement';
COMMENT ON COLUMN public.engagements.image_url IS 'URL de l''image associée à l''engagement';
COMMENT ON COLUMN public.engagements.ordre IS 'Ordre d''affichage automatique basé sur la date de création (plus petit = plus ancien = affiché en premier)';
COMMENT ON COLUMN public.engagements.is_active IS 'Indique si l''engagement est actif et doit être affiché';

-- ===========================================
-- FONCTIONS UTILITAIRES
-- ===========================================

-- Fonction pour réorganiser manuellement si nécessaire
CREATE OR REPLACE FUNCTION reorder_engagements()
RETURNS TABLE(id UUID, title VARCHAR, old_ordre INTEGER, new_ordre INTEGER) AS $$
BEGIN
    -- Sauvegarder les anciens ordres
    CREATE TEMP TABLE temp_old_ordre AS 
    SELECT e.id, e.title, e.ordre as old_ordre 
    FROM public.engagements e;
    
    -- Réorganiser
    PERFORM reorganize_all_engagements_ordre();
    
    -- Retourner les changements
    RETURN QUERY
    SELECT t.id, t.title, t.old_ordre, e.ordre as new_ordre
    FROM temp_old_ordre t
    JOIN public.engagements e ON t.id = e.id
    ORDER BY e.ordre;
    
    DROP TABLE temp_old_ordre;
END;
$$ LANGUAGE plpgsql;
