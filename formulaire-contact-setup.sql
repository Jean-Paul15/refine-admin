-- Table pour les formulaires de contact/dons/engagements
CREATE TABLE public.formulaire_contact (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom_complet text NOT NULL,
  email text NOT NULL,
  telephone text NOT NULL,
  pays text NOT NULL,
  montant numeric(10, 2) NULL,
  message text NULL,
  est_engagement boolean NOT NULL DEFAULT false,
  date_creation timestamp with time zone NULL DEFAULT now(),
  statut text NULL DEFAULT 'nouveau'::text,
  CONSTRAINT formulaire_contact_pkey PRIMARY KEY (id),
  CONSTRAINT formulaire_contact_statut_check CHECK (
    (
      statut = ANY (
        ARRAY['nouveau'::text, 'contacte'::text, 'traite'::text]
      )
    )
  ),
  CONSTRAINT valid_email CHECK (
    (
      email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text
    )
  ),
  CONSTRAINT valid_phone CHECK ((telephone ~ '^\+?[0-9\s\-\(\)]{8,20}$'::text))
) TABLESPACE pg_default;

-- Index pour optimiser les requêtes
CREATE INDEX idx_formulaire_contact_statut ON public.formulaire_contact(statut);
CREATE INDEX idx_formulaire_contact_date_creation ON public.formulaire_contact(date_creation DESC);
CREATE INDEX idx_formulaire_contact_est_engagement ON public.formulaire_contact(est_engagement);

-- Commentaires pour la documentation
COMMENT ON TABLE public.formulaire_contact IS 'Table pour stocker les formulaires de contact, dons et engagements';
COMMENT ON COLUMN public.formulaire_contact.nom_complet IS 'Nom complet de la personne';
COMMENT ON COLUMN public.formulaire_contact.email IS 'Adresse email de contact';
COMMENT ON COLUMN public.formulaire_contact.telephone IS 'Numéro de téléphone';
COMMENT ON COLUMN public.formulaire_contact.pays IS 'Pays de résidence';
COMMENT ON COLUMN public.formulaire_contact.montant IS 'Montant du don en euros';
COMMENT ON COLUMN public.formulaire_contact.message IS 'Message ou demande spécifique';
COMMENT ON COLUMN public.formulaire_contact.est_engagement IS 'Indique si c''est un engagement de don régulier';
COMMENT ON COLUMN public.formulaire_contact.date_creation IS 'Date et heure de création du formulaire';
COMMENT ON COLUMN public.formulaire_contact.statut IS 'Statut du traitement: nouveau, contacte, traite';
