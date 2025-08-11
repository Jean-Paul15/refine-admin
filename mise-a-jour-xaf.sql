-- Mise à jour pour passer de EUR à XAF
-- Convertir les montants existants d'euros vers francs CFA
-- Taux approximatif : 1 EUR = 656 XAF

UPDATE public.formulaire_contact 
SET montant = CASE 
    WHEN montant IS NOT NULL THEN montant * 656
    ELSE NULL
END;

-- Mise à jour du commentaire de la colonne
COMMENT ON COLUMN public.formulaire_contact.montant IS 'Montant du don en francs CFA (XAF)';

-- Mettre à jour les données de test avec des montants réalistes en XAF
UPDATE public.formulaire_contact 
SET 
    montant = CASE nom_complet
        WHEN 'Marie Dupont' THEN 30000
        WHEN 'Pierre Martin' THEN 50000
        WHEN 'Sophie Laurent' THEN 15000
        ELSE montant
    END,
    pays = CASE nom_complet
        WHEN 'Marie Dupont' THEN 'Cameroun'
        WHEN 'Pierre Martin' THEN 'Cameroun'
        WHEN 'Sophie Laurent' THEN 'Cameroun'
        ELSE pays
    END,
    telephone = CASE nom_complet
        WHEN 'Marie Dupont' THEN '+237 6 12 34 56 78'
        WHEN 'Pierre Martin' THEN '+237 6 98 76 54 32'
        WHEN 'Sophie Laurent' THEN '+237 7 11 22 33 44'
        ELSE telephone
    END
WHERE nom_complet IN ('Marie Dupont', 'Pierre Martin', 'Sophie Laurent');
