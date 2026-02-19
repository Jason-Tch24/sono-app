-- ================================================
-- CORRECTION : Création automatique des profils
-- À exécuter dans Supabase Dashboard > SQL Editor
-- ================================================

-- 1. Créer une fonction qui s'exécute à chaque nouvelle inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'sonoriste') -- Récupère le rôle choisi par l'utilisateur
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attacher la fonction à un trigger sur la table auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. [IMPORTANT] Rattraper les utilisateurs déjà créés (qui n'ont pas de profil public)
INSERT INTO public.users (id, email, role)
SELECT id, email, COALESCE(raw_user_meta_data->>'role', 'sonoriste')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);
