# Architecture de l'Application Sono Église

## 🏗️ Vue d'Ensemble

L'application suit une architecture client-serveur moderne avec :
- **Frontend** : Next.js 15 (App Router) + React + TypeScript
- **Backend** : Supabase (PostgreSQL + Auth + RLS)
- **Styling** : Tailwind CSS

## 📊 Schéma de Base de Données

### Tables Principales

```
┌─────────────────┐
│   auth.users    │ (Supabase Auth)
│  - id (UUID)    │
│  - email        │
└────────┬────────┘
         │
         │ 1:1
         ▼
┌─────────────────┐
│  public.users   │
│  - id (FK)      │
│  - email        │
│  - role         │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐       ┌──────────────────────┐
│  services       │       │  checklist_items     │
│  - id           │       │  - id                │
│  - date         │       │  - phase             │
│  - user_id (FK) │       │  - label             │
│  - status       │       │  - display_order     │
└────────┬────────┘       └──────────┬───────────┘
         │                           │
         │ 1:N                       │
         ├───────────────────────────┤
         │                           │
         ▼                           ▼
┌─────────────────────────────────────────┐
│      checklist_progress                 │
│  - id                                   │
│  - service_id (FK)                      │
│  - checklist_item_id (FK)               │
│  - checked                              │
│  - checked_at                           │
└─────────────────────────────────────────┘

         │ 1:N
         ├──────────────┬──────────────┐
         ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   remarks    │ │  incidents   │ │   (autres)   │
│ - service_id │ │ - service_id │ │              │
│ - phase      │ │ - type       │ │              │
│ - content    │ │ - description│ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

## 🔐 Sécurité (Row Level Security)

### Politiques RLS Implémentées

1. **users** : Les utilisateurs peuvent voir et modifier leur propre profil
2. **services** : Tous peuvent voir, seul le créateur peut modifier
3. **checklist_items** : Lecture seule pour tous (données de référence)
4. **checklist_progress** : Géré uniquement par le propriétaire du service
5. **remarks** : Gérées uniquement par le propriétaire du service
6. **incidents** : Gérés uniquement par le propriétaire du service

## 🎯 Flux de l'Application

### 1. Authentification
```
Login Page (/)
    ↓
Supabase Auth
    ↓
Dashboard (/dashboard)
```

### 2. Création de Service
```
Dashboard
    ↓
Click "Nouveau Service"
    ↓
INSERT INTO services
    ↓
Redirect to /service/[id]
```

### 3. Gestion du Service
```
Service Page
    ↓
┌─────────────────────────────────┐
│  Phase Navigation               │
│  [Avant] [Pendant] [Après]      │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Checklist (gauche)             │
│  - Load checklist_items         │
│  - Load checklist_progress      │
│  - Toggle items                 │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Remarques & Incidents (droite) │
│  - Add remarks                  │
│  - Add incidents                │
└─────────────────────────────────┘
    ↓
Terminer le Service
    ↓
UPDATE services SET status='termine'
    ↓
Redirect to Dashboard
```

## 📁 Structure des Fichiers

```
sono/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Login (/)
│   ├── layout.tsx                # Layout racine
│   ├── globals.css               # Styles globaux
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard (/dashboard)
│   └── service/[id]/
│       └── page.tsx              # Service detail (/service/[id])
│
├── lib/
│   └── supabase.ts               # Client Supabase + Types
│
├── supabase-schema.sql           # Schéma DB (tables + RLS)
├── supabase-seed-data.sql        # Données initiales
│
├── package.json                  # Dépendances
├── tsconfig.json                 # Config TypeScript
├── tailwind.config.ts            # Config Tailwind
├── next.config.js                # Config Next.js
│
├── README.md                     # Documentation principale
├── GUIDE-DEMARRAGE.md            # Guide pas à pas
├── EXEMPLES-REQUETES.md          # Requêtes SQL utiles
└── ARCHITECTURE.md               # Ce fichier
```

## 🔄 Cycle de Vie d'un Service

1. **Création** : `status = 'en_cours'`, `date = aujourd'hui`
2. **Avant le culte** : Checklist d'allumage (12 items)
3. **Pendant le culte** : Surveillance + remarques + incidents
4. **Après le culte** : Checklist d'extinction (7 items)
5. **Terminaison** : `status = 'termine'`

## 🎨 Composants UI

### Pages
- **LoginPage** (`/`) : Formulaire de connexion
- **DashboardPage** (`/dashboard`) : Liste des services + bouton création
- **ServicePage** (`/service/[id]`) : Gestion complète d'un service

### Éléments Réutilisables
- Boutons de navigation de phase
- Items de checklist avec checkbox
- Formulaires de remarques
- Formulaires d'incidents
- Cards de statut

## 🚀 Optimisations Possibles (Futures)

1. **Performance**
   - Pagination de l'historique
   - Cache des checklist_items
   - Optimistic UI updates

2. **Fonctionnalités**
   - Export PDF du service
   - Statistiques avancées
   - Notifications temps réel
   - Mode hors ligne

3. **UX**
   - Thème sombre
   - Raccourcis clavier
   - Drag & drop pour réorganiser
   - Templates de remarques

## 📱 Responsive Design

L'application est responsive :
- **Mobile** : Navigation verticale, colonnes empilées
- **Tablet** : Layout adaptatif
- **Desktop** : Layout 2 colonnes (checklist + remarques/incidents)

## 🔧 Variables d'Environnement

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

**Note** : Le préfixe `NEXT_PUBLIC_` expose les variables au client.

## 📊 Types TypeScript

Tous les types sont définis dans `lib/supabase.ts` :
- `User`
- `Service`
- `ChecklistItem`
- `ChecklistProgress`
- `Remark`
- `Incident`

Ces types correspondent exactement au schéma PostgreSQL.

