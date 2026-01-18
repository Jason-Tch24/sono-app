# Configuration Supabase - Sono Église

## 📋 Ordre d'Exécution

**IMPORTANT** : Exécutez les fichiers SQL dans cet ordre exact :

1. ✅ `supabase-schema.sql` (Schéma + Tables + RLS)
2. ✅ `supabase-seed-data.sql` (Données initiales)
3. ✅ Créer l'utilisateur (voir ci-dessous)

---

## 🗄️ Étape 1 : Schéma de Base de Données

### Fichier : `supabase-schema.sql`

**Ce fichier crée :**
- 6 tables (users, services, checklist_items, checklist_progress, remarks, incidents)
- Index pour les performances
- Politiques Row Level Security (RLS)

**Comment l'exécuter :**
1. Supabase Dashboard → SQL Editor
2. New Query
3. Copier TOUT le contenu de `supabase-schema.sql`
4. Coller dans l'éditeur
5. Cliquer sur "Run" (ou Ctrl+Enter)
6. Attendre le message de succès ✅

**Résultat attendu :**
```
Success. No rows returned
```

---

## 📝 Étape 2 : Données Initiales

### Fichier : `supabase-seed-data.sql`

**Ce fichier insère :**
- 12 items de checklist "Avant le culte"
- 5 items de checklist "Pendant le culte"
- 7 items de checklist "Après le culte"
- **Total : 24 items**

**Comment l'exécuter :**
1. Supabase Dashboard → SQL Editor
2. New Query
3. Copier TOUT le contenu de `supabase-seed-data.sql`
4. Coller dans l'éditeur
5. Cliquer sur "Run"
6. Attendre le message de succès ✅

**Résultat attendu :**
```
Success. No rows returned
```

**Vérification :**
```sql
SELECT COUNT(*) FROM public.checklist_items;
-- Devrait retourner : 24
```

---

## 👤 Étape 3 : Créer l'Utilisateur Test

### Option A : Via l'Interface Supabase (Recommandé)

1. **Créer l'utilisateur dans Auth**
   - Authentication → Users → "Add User"
   - Email : `sonoriste@eglise.com`
   - Password : `SonoEglise2024!` (ou votre choix)
   - ✅ Cocher "Auto Confirm User"
   - Cliquer sur "Create User"

2. **Copier l'ID de l'utilisateur**
   - Format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Exemple : `550e8400-e29b-41d4-a716-446655440000`

3. **Lier à la table users**
   - SQL Editor → New Query
   - Exécuter (remplacer `VOTRE_USER_ID`) :

```sql
INSERT INTO public.users (id, email, role)
VALUES (
  'VOTRE_USER_ID',  -- Remplacer par l'ID copié
  'sonoriste@eglise.com',
  'sonoriste'
);
```

### Option B : Via SQL (Avancé)

**Note** : Cette méthode nécessite des privilèges admin sur auth.users

```sql
-- 1. Créer l'utilisateur dans auth.users
-- (Utilisez plutôt l'interface Supabase pour cette étape)

-- 2. Récupérer l'ID de l'utilisateur
SELECT id, email FROM auth.users WHERE email = 'sonoriste@eglise.com';

-- 3. Insérer dans public.users
INSERT INTO public.users (id, email, role)
SELECT id, email, 'sonoriste'
FROM auth.users
WHERE email = 'sonoriste@eglise.com';
```

---

## ✅ Vérification de l'Installation

### Vérifier les tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Résultat attendu :**
- checklist_items
- checklist_progress
- incidents
- remarks
- services
- users

### Vérifier les données
```sql
-- Compter les items de checklist
SELECT phase, COUNT(*) as nombre
FROM public.checklist_items
GROUP BY phase;
```

**Résultat attendu :**
| phase | nombre |
|-------|--------|
| before_service | 12 |
| during_service | 5 |
| after_service | 7 |

### Vérifier l'utilisateur
```sql
SELECT * FROM public.users;
```

**Résultat attendu :**
| id | email | role | created_at |
|----|-------|------|------------|
| xxx-xxx-xxx | sonoriste@eglise.com | sonoriste | 2024-... |

### Vérifier RLS
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**Résultat attendu :** Toutes les tables doivent avoir `rowsecurity = true`

---

## 🔑 Récupérer les Clés API

1. **Settings** (icône engrenage) → **API**

2. **Copier ces valeurs :**
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **Les mettre dans `.env.local` :**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 Checklist Complète

- [ ] Projet Supabase créé
- [ ] `supabase-schema.sql` exécuté avec succès
- [ ] `supabase-seed-data.sql` exécuté avec succès
- [ ] 24 items de checklist insérés
- [ ] Utilisateur créé dans Authentication
- [ ] Utilisateur lié dans table `public.users`
- [ ] URL et clé API copiées
- [ ] `.env.local` créé avec les bonnes valeurs

---

## ❓ Problèmes Courants

### "relation does not exist"
→ Vous n'avez pas exécuté `supabase-schema.sql`

### "duplicate key value"
→ Vous avez déjà exécuté le script. C'est normal, ignorez l'erreur.

### "permission denied"
→ Vérifiez que vous êtes bien connecté en tant qu'admin du projet

### "invalid input syntax for type uuid"
→ Vérifiez que vous avez bien remplacé `VOTRE_USER_ID` par un UUID valide

---

## 🔄 Réinitialiser la Base de Données

**ATTENTION : Ceci supprime TOUTES les données**

```sql
-- Supprimer toutes les tables
DROP TABLE IF EXISTS public.checklist_progress CASCADE;
DROP TABLE IF EXISTS public.remarks CASCADE;
DROP TABLE IF EXISTS public.incidents CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.checklist_items CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Puis ré-exécuter supabase-schema.sql et supabase-seed-data.sql
```

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans Supabase → Logs
2. Consultez `EXEMPLES-REQUETES.md` pour des requêtes de débogage
3. Vérifiez que toutes les étapes ont été suivies dans l'ordre

---

**Une fois cette configuration terminée, vous êtes prêt à lancer l'application !**

→ Suivez ensuite `GUIDE-DEMARRAGE.md` pour la configuration du projet Next.js

