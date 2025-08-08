-- Configuration du stockage Supabase pour les uploads
-- Exécutez ces commandes dans l'éditeur SQL de Supabase

-- 1. Créer le bucket de stockage pour les uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true);

-- 2. Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Les utilisateurs authentifiés peuvent uploader des fichiers" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'uploads');

-- 3. Politique pour permettre la lecture publique des fichiers
CREATE POLICY "Les fichiers uploads sont accessibles publiquement" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'uploads');

-- 4. Politique pour permettre la suppression aux propriétaires
CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres fichiers" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 5. Politique pour permettre la mise à jour aux propriétaires
CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs propres fichiers" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Note: Après avoir exécuté ce script, allez dans l'interface Supabase > Storage
-- et créez manuellement le bucket 'uploads' si ce n'est pas fait automatiquement
