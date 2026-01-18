# Exemples de Requêtes Supabase

Ce document contient des exemples de requêtes SQL utiles pour tester et gérer l'application.

## 📊 Requêtes de Consultation

### Voir tous les utilisateurs
```sql
SELECT * FROM public.users;
```

### Voir tous les services
```sql
SELECT 
  s.*,
  u.email as sonoriste_email
FROM public.services s
LEFT JOIN public.users u ON s.user_id = u.id
ORDER BY s.date DESC;
```

### Voir les items de checklist par phase
```sql
-- Avant le culte
SELECT * FROM public.checklist_items 
WHERE phase = 'before_service' 
ORDER BY display_order;

-- Pendant le culte
SELECT * FROM public.checklist_items 
WHERE phase = 'during_service' 
ORDER BY display_order;

-- Après le culte
SELECT * FROM public.checklist_items 
WHERE phase = 'after_service' 
ORDER BY display_order;
```

### Voir la progression d'un service spécifique
```sql
-- Remplacez 'SERVICE_ID' par l'ID réel du service
SELECT 
  ci.label,
  ci.phase,
  cp.checked,
  cp.checked_at
FROM public.checklist_progress cp
JOIN public.checklist_items ci ON cp.checklist_item_id = ci.id
WHERE cp.service_id = 'SERVICE_ID'
ORDER BY ci.phase, ci.display_order;
```

### Voir toutes les remarques d'un service
```sql
-- Remplacez 'SERVICE_ID' par l'ID réel du service
SELECT * FROM public.remarks 
WHERE service_id = 'SERVICE_ID'
ORDER BY created_at DESC;
```

### Voir tous les incidents d'un service
```sql
-- Remplacez 'SERVICE_ID' par l'ID réel du service
SELECT * FROM public.incidents 
WHERE service_id = 'SERVICE_ID'
ORDER BY created_at DESC;
```

### Statistiques globales
```sql
-- Nombre total de services
SELECT COUNT(*) as total_services FROM public.services;

-- Nombre de services terminés
SELECT COUNT(*) as services_termines 
FROM public.services 
WHERE status = 'termine';

-- Nombre total d'incidents par type
SELECT type, COUNT(*) as nombre
FROM public.incidents
GROUP BY type
ORDER BY nombre DESC;
```

## ➕ Requêtes d'Insertion

### Créer un nouvel utilisateur (après création dans Auth)
```sql
-- Remplacez les valeurs par les vraies données
INSERT INTO public.users (id, email, role)
VALUES (
  'USER_ID_FROM_AUTH',
  'nouveau@eglise.com',
  'sonoriste'  -- ou 'responsable'
);
```

### Créer un service manuellement
```sql
-- Remplacez USER_ID par l'ID d'un utilisateur existant
INSERT INTO public.services (date, user_id, status)
VALUES (
  '2024-01-21',  -- Date du service
  'USER_ID',
  'en_cours'
)
RETURNING *;
```

### Ajouter une remarque
```sql
-- Remplacez SERVICE_ID par l'ID d'un service existant
INSERT INTO public.remarks (service_id, phase, content)
VALUES (
  'SERVICE_ID',
  'during_service',  -- ou 'before_service', 'after_service'
  'Le micro du prédicateur avait un peu de souffle'
)
RETURNING *;
```

### Signaler un incident
```sql
-- Remplacez SERVICE_ID par l'ID d'un service existant
INSERT INTO public.incidents (service_id, type, description)
VALUES (
  'SERVICE_ID',
  'larsen',  -- ou 'micro', 'hf', 'autre'
  'Larsen sur le retour de scène gauche pendant la louange'
)
RETURNING *;
```

## 🔄 Requêtes de Mise à Jour

### Terminer un service
```sql
-- Remplacez SERVICE_ID par l'ID d'un service existant
UPDATE public.services
SET status = 'termine', updated_at = NOW()
WHERE id = 'SERVICE_ID'
RETURNING *;
```

### Marquer un item de checklist comme fait
```sql
-- Remplacez les IDs par les vraies valeurs
INSERT INTO public.checklist_progress (service_id, checklist_item_id, checked, checked_at)
VALUES (
  'SERVICE_ID',
  'CHECKLIST_ITEM_ID',
  true,
  NOW()
)
ON CONFLICT (service_id, checklist_item_id) 
DO UPDATE SET 
  checked = true,
  checked_at = NOW();
```

## 🗑️ Requêtes de Nettoyage

### Supprimer un service (et toutes ses données associées)
```sql
-- ATTENTION : Ceci supprime définitivement le service et toutes ses données
-- Remplacez SERVICE_ID par l'ID du service à supprimer
DELETE FROM public.services WHERE id = 'SERVICE_ID';
-- Les remarques, incidents et progression sont supprimés automatiquement (CASCADE)
```

### Réinitialiser tous les services (DANGER)
```sql
-- ATTENTION : Ceci supprime TOUS les services
-- À utiliser uniquement en développement
TRUNCATE public.services CASCADE;
```

## 🔍 Requêtes de Débogage

### Vérifier les politiques RLS
```sql
-- Voir si RLS est activé sur les tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Voir l'utilisateur actuellement connecté
```sql
SELECT auth.uid() as current_user_id;
```

### Compter les items de checklist par phase
```sql
SELECT phase, COUNT(*) as nombre_items
FROM public.checklist_items
GROUP BY phase
ORDER BY 
  CASE phase
    WHEN 'before_service' THEN 1
    WHEN 'during_service' THEN 2
    WHEN 'after_service' THEN 3
  END;
```

## 💡 Conseils

- Utilisez toujours `RETURNING *` après INSERT/UPDATE pour voir le résultat
- Les IDs sont au format UUID (ex: `550e8400-e29b-41d4-a716-446655440000`)
- Les dates sont au format ISO 8601 (ex: `2024-01-21`)
- Les timestamps incluent le fuseau horaire (ex: `2024-01-21 14:30:00+00`)

