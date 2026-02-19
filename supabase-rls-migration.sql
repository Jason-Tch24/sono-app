-- ================================================
-- MIGRATION : Historique isolé par utilisateur
-- À exécuter dans Supabase Dashboard > SQL Editor
-- ================================================

-- 1. Supprimer les anciennes politiques permissives sur services
DROP POLICY IF EXISTS "Users can view all services" ON public.services;

-- 2. Remplacer par une politique qui filtre par propriétaire
CREATE POLICY "Users can only view their own services" ON public.services
  FOR SELECT USING (auth.uid() = user_id);

-- 3. Supprimer les anciennes politiques permissives sur checklist_progress
DROP POLICY IF EXISTS "Users can view all checklist progress" ON public.checklist_progress;

-- 4. Remplacer par une politique filtrée
CREATE POLICY "Users can only view checklist progress for their services" ON public.checklist_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE services.id = checklist_progress.service_id
      AND services.user_id = auth.uid()
    )
  );

-- 5. Supprimer les anciennes politiques permissives sur remarks
DROP POLICY IF EXISTS "Users can view all remarks" ON public.remarks;

-- 6. Remplacer par une politique filtrée
CREATE POLICY "Users can only view remarks for their services" ON public.remarks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE services.id = remarks.service_id
      AND services.user_id = auth.uid()
    )
  );

-- 7. Supprimer les anciennes politiques permissives sur incidents
DROP POLICY IF EXISTS "Users can view all incidents" ON public.incidents;

-- 8. Remplacer par une politique filtrée
CREATE POLICY "Users can only view incidents for their services" ON public.incidents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE services.id = incidents.service_id
      AND services.user_id = auth.uid()
    )
  );
