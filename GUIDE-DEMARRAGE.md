# 🚀 Guide de Démarrage Rapide - Sono Église

## Étape 1 : Configuration Supabase (5 minutes)

### 1.1 Créer le projet
1. Allez sur https://supabase.com
2. Cliquez sur "New Project"
3. Choisissez un nom (ex: "sono-eglise")
4. Définissez un mot de passe de base de données (notez-le)
5. Choisissez une région proche (ex: Europe West)
6. Cliquez sur "Create new project"

### 1.2 Exécuter le SQL
1. Dans votre projet Supabase, cliquez sur "SQL Editor" dans le menu de gauche
2. Cliquez sur "New query"
3. Copiez TOUT le contenu du fichier `supabase-schema.sql`
4. Collez-le dans l'éditeur
5. Cliquez sur "Run" (ou Ctrl+Enter)
6. Attendez le message de succès ✅

7. Créez une nouvelle query
8. Copiez TOUT le contenu du fichier `supabase-seed-data.sql`
9. Collez-le et cliquez sur "Run"
10. Attendez le message de succès ✅

### 1.3 Créer un utilisateur
1. Cliquez sur "Authentication" dans le menu de gauche
2. Cliquez sur "Users"
3. Cliquez sur "Add User" (bouton vert)
4. Remplissez :
   - Email: `sonoriste@eglise.com`
   - Password: `SonoEglise2024!` (ou votre choix)
   - ✅ Cochez "Auto Confirm User"
5. Cliquez sur "Create User"
6. **IMPORTANT** : Copiez l'ID de l'utilisateur (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

### 1.4 Lier l'utilisateur à la table users
1. Retournez dans "SQL Editor"
2. Créez une nouvelle query
3. Collez ce code (remplacez `VOTRE_USER_ID` par l'ID copié) :

```sql
INSERT INTO public.users (id, email, role)
VALUES (
  'VOTRE_USER_ID',  -- Remplacez par l'ID copié
  'sonoriste@eglise.com',
  'sonoriste'
);
```

4. Cliquez sur "Run"

### 1.5 Récupérer les clés
1. Cliquez sur "Settings" (icône engrenage) dans le menu de gauche
2. Cliquez sur "API"
3. Copiez :
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon public** key (la clé qui commence par "eyJ...")

---

## Étape 2 : Configuration du Projet (2 minutes)

### 2.1 Installer les dépendances
```bash
cd /Applications/MAMP/htdocs/sono
npm install
```

### 2.2 Créer le fichier .env.local
Créez un fichier `.env.local` à la racine du projet avec ce contenu :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Remplacez** les valeurs par celles copiées à l'étape 1.5

---

## Étape 3 : Lancer l'Application (1 minute)

```bash
npm run dev
```

Ouvrez votre navigateur sur : **http://localhost:3000**

---

## Étape 4 : Première Connexion

1. Email: `sonoriste@eglise.com`
2. Mot de passe: celui que vous avez défini (ex: `SonoEglise2024!`)
3. Cliquez sur "Se connecter"

---

## 🎉 C'est Prêt !

Vous devriez voir le dashboard. Cliquez sur "Nouveau Service" pour commencer.

---

## ❓ Problèmes Courants

### "Invalid login credentials"
- Vérifiez que l'utilisateur est bien créé dans Supabase > Authentication > Users
- Vérifiez que l'utilisateur est bien dans la table `public.users`
- Vérifiez que le mot de passe est correct

### "Failed to fetch"
- Vérifiez que les variables d'environnement dans `.env.local` sont correctes
- Vérifiez que l'URL Supabase est bien au format `https://xxxxx.supabase.co`
- Redémarrez le serveur de développement (`npm run dev`)

### Erreur SQL
- Vérifiez que vous avez bien exécuté `supabase-schema.sql` AVANT `supabase-seed-data.sql`
- Vérifiez qu'il n'y a pas d'erreurs dans la console SQL de Supabase

---

## 📞 Support

Si vous rencontrez des problèmes, vérifiez :
1. Les logs dans la console du navigateur (F12)
2. Les logs du terminal où tourne `npm run dev`
3. Les logs dans Supabase > Logs

