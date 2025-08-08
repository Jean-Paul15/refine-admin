-- Structure Supabase simplifiée - 5 tables uniquement
-- Créé le 7 août 2025

-- Création du bucket de stockage pour les uploads
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', true);

-- Politique pour permettre à tous les utilisateurs authentifiés d'uploader des fichiers
create policy "Utilisateurs authentifiés peuvent uploader des fichiers"
on storage.objects for insert
with check (bucket_id = 'uploads' and auth.role() = 'authenticated');

-- Politique pour permettre à tous de voir les fichiers uploadés
create policy "Les fichiers uploadés sont visibles par tous"
on storage.objects for select
using (bucket_id = 'uploads');

-- Politique pour permettre aux utilisateurs authentifiés de supprimer leurs fichiers
create policy "Utilisateurs authentifiés peuvent supprimer les fichiers"
on storage.objects for delete
using (bucket_id = 'uploads' and auth.role() = 'authenticated');

-- Table des profils utilisateurs
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text unique,
    first_name text,
    last_name text,
    role text default 'user',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Table des abonnés newsletter
create table public.newsletter_subscribers (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    subscribed_at timestamp with time zone default now(),
    is_active boolean default true
);

-- Table des articles
create table public.articles (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    image_url text,
    published_date date,
    short_description text,
    content text,
    author_id uuid references public.profiles(id) on delete set null,
    is_published boolean default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Table des actions
create table public.actions (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    image_url text,
    description text,
    full_content text,
    type text, -- ex: 'carrousel', 'principale', 'passée'
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Table des paramètres
create table public.settings (
    id uuid primary key default gen_random_uuid(),
    key text not null unique, -- ex: 'phone', 'address', 'facebook_url'
    value text,
    description text, -- optionnel pour documenter
    updated_at timestamp with time zone default now()
);

-- RLS (Row Level Security) policies
alter table public.profiles enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.articles enable row level security;
alter table public.actions enable row level security;
alter table public.settings enable row level security;

-- Policies pour les profils
create policy "Public profiles are viewable by everyone."
on profiles for select
using ( true );

create policy "Users can insert their own profile."
on profiles for insert
with check ( auth.uid() = id );

create policy "Users can update own profile."
on profiles for update
using ( auth.uid() = id );

-- Policies pour les newsletter subscribers
create policy "Newsletter subscribers are viewable by authenticated users."
on newsletter_subscribers for select
using ( auth.role() = 'authenticated' );

create policy "Anyone can subscribe to newsletter."
on newsletter_subscribers for insert
with check ( true );

create policy "Users can update newsletter subscriptions."
on newsletter_subscribers for update
using ( auth.role() = 'authenticated' );

-- Policies pour les articles
create policy "Articles are viewable by everyone."
on articles for select
using ( true );

create policy "Authenticated users can insert articles."
on articles for insert
with check ( auth.role() = 'authenticated' );

create policy "Users can update articles."
on articles for update
using ( auth.role() = 'authenticated' );

-- Policies pour les actions
create policy "Actions are viewable by everyone."
on actions for select
using ( true );

create policy "Authenticated users can insert actions."
on actions for insert
with check ( auth.role() = 'authenticated' );

create policy "Users can update actions."
on actions for update
using ( auth.role() = 'authenticated' );

-- Policies pour les settings
create policy "Settings are viewable by authenticated users."
on settings for select
using ( auth.role() = 'authenticated' );

create policy "Authenticated users can insert settings."
on settings for insert
with check ( auth.role() = 'authenticated' );

create policy "Users can update settings."
on settings for update
using ( auth.role() = 'authenticated' );

-- Données d'exemple pour les paramètres
insert into public.settings (key, value, description) values
('site_name', 'Mon Site Admin', 'Nom du site'),
('contact_email', 'contact@monsite.com', 'Email de contact'),
('phone', '+33 1 23 45 67 89', 'Numéro de téléphone'),
('address', '123 Rue Example, 75001 Paris', 'Adresse physique'),
('facebook_url', 'https://facebook.com/monsite', 'URL Facebook'),
('twitter_url', 'https://twitter.com/monsite', 'URL Twitter'),
('linkedin_url', 'https://linkedin.com/company/monsite', 'URL LinkedIn'),
('about_text', 'Description de mon organisation...', 'Texte de présentation');
