-- Script SQL pour créer automatiquement un profil lors de l'inscription d'un utilisateur
-- Exécutez ces commandes dans l'éditeur SQL de Supabase

-- 1. Créer la fonction qui sera appelée lors de l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    'user'
  );
  return new;
end;
$$;

-- 2. Créer le trigger qui exécute la fonction après l'insertion d'un nouvel utilisateur
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Optionnel : Créer une fonction pour synchroniser les mises à jour d'email
create or replace function public.handle_user_update()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set email = new.email
  where id = new.id;
  return new;
end;
$$;

-- 4. Trigger pour synchroniser les mises à jour d'email
create trigger on_auth_user_updated
  after update of email on auth.users
  for each row execute procedure public.handle_user_update();
