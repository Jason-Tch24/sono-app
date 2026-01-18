# Sono Église - Application de Gestion de Sonorisation

Application MVP pour gérer la sonorisation des cultes à l'église.

## 🚀 Installation et Démarrage Rapide

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer Supabase

#### A. Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL et votre clé anonyme (anon key)

#### B. Exécuter le schéma SQL
1. Dans votre projet Supabase, allez dans "SQL Editor"
2. Copiez et exécutez le contenu de `supabase-schema.sql`
3. Ensuite, exécutez le contenu de `supabase-seed-data.sql`

#### C. Créer un utilisateur test
Dans le SQL Editor de Supabase, exécutez :

```sql
-- Créer un utilisateur dans auth.users (Supabase Auth)
-- Note: Vous pouvez aussi le faire via l'interface Supabase > Authentication > Users > Add User

-- Après avoir créé l'utilisateur via l'interface, récupérez son ID et ajoutez-le dans la table users
INSERT INTO public.users (id, email, role)
VALUES (
  'VOTRE_USER_ID_ICI',  -- Remplacez par l'ID de l'utilisateur créé
  'sonoriste@eglise.com',
  'sonoriste'
);
```

**OU** créez directement via l'interface Supabase :
1. Allez dans "Authentication" > "Users"
2. Cliquez sur "Add User"
3. Email: `sonoriste@eglise.com`
4. Password: `password123` (ou autre)
5. Confirmez l'email automatiquement
6. Copiez l'ID de l'utilisateur créé
7. Allez dans "Table Editor" > "users" > "Insert row"
8. Collez l'ID, l'email et le rôle "sonoriste"

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme
```

### 4. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📋 Utilisation

### Connexion
- Email: `sonoriste@eglise.com`
- Mot de passe: celui que vous avez défini

### Workflow
1. **Créer un nouveau service** depuis le dashboard
2. **Avant le culte** : Cocher les items de la checklist d'allumage
3. **Pendant le culte** : Ajouter des remarques et signaler des incidents
4. **Après le culte** : Cocher les items d'extinction
5. **Terminer le service** pour l'archiver

## 🗂️ Structure du Projet

```
sono/
├── app/
│   ├── page.tsx              # Page de connexion
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard avec historique
│   ├── service/[id]/
│   │   └── page.tsx          # Gestion d'un service
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   └── supabase.ts           # Configuration Supabase + Types
├── supabase-schema.sql       # Schéma de base de données
├── supabase-seed-data.sql    # Données initiales (checklist)
└── package.json
```

## 🎯 Fonctionnalités

- ✅ Authentification utilisateur
- ✅ Création de services par date
- ✅ Checklists guidées (avant/pendant/après)
- ✅ Ajout de remarques par phase
- ✅ Signalement d'incidents (larsen, micro, HF, autre)
- ✅ Historique des services
- ✅ Validation finale du service

## 🔧 Technologies

- **Frontend**: Next.js 15 + React + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Déploiement**: Vercel (recommandé)

## 📝 Notes

- Le design est volontairement simple et fonctionnel
- Les checklists sont basées sur le processus réel de sonorisation
- L'application est prête pour un déploiement en production

