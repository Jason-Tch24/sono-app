-- ============================================
-- SCHÉMA SQL POUR SUPABASE - APPLICATION SONO
-- ============================================

-- Table des utilisateurs (étend auth.users de Supabase)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('sonoriste', 'responsable')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des services
CREATE TABLE public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'en_cours' CHECK (status IN ('en_cours', 'termine')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des items de checklist (données de référence)
CREATE TABLE public.checklist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phase TEXT NOT NULL CHECK (phase IN ('before_service', 'during_service', 'after_service')),
  label TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de progression des checklists
CREATE TABLE public.checklist_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  checklist_item_id UUID REFERENCES public.checklist_items(id) ON DELETE CASCADE NOT NULL,
  checked BOOLEAN DEFAULT FALSE,
  checked_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(service_id, checklist_item_id)
);

-- Table des remarques
CREATE TABLE public.remarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('before_service', 'during_service', 'after_service')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des incidents
CREATE TABLE public.incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('larsen', 'micro', 'hf', 'autre')),
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_services_user_id ON public.services(user_id);
CREATE INDEX idx_services_date ON public.services(date);
CREATE INDEX idx_checklist_progress_service_id ON public.checklist_progress(service_id);
CREATE INDEX idx_remarks_service_id ON public.remarks(service_id);
CREATE INDEX idx_incidents_service_id ON public.incidents(service_id);

-- Activer Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Politiques RLS pour services
CREATE POLICY "Users can view all services" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "Users can create services" ON public.services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own services" ON public.services
  FOR UPDATE USING (auth.uid() = user_id);

-- Politiques RLS pour checklist_items (lecture seule pour tous)
CREATE POLICY "Anyone can view checklist items" ON public.checklist_items
  FOR SELECT USING (true);

-- Politiques RLS pour checklist_progress
CREATE POLICY "Users can view all checklist progress" ON public.checklist_progress
  FOR SELECT USING (true);

CREATE POLICY "Users can manage checklist progress for their services" ON public.checklist_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE services.id = checklist_progress.service_id
      AND services.user_id = auth.uid()
    )
  );

-- Politiques RLS pour remarks
CREATE POLICY "Users can view all remarks" ON public.remarks
  FOR SELECT USING (true);

CREATE POLICY "Users can manage remarks for their services" ON public.remarks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE services.id = remarks.service_id
      AND services.user_id = auth.uid()
    )
  );

-- Politiques RLS pour incidents
CREATE POLICY "Users can view all incidents" ON public.incidents
  FOR SELECT USING (true);

CREATE POLICY "Users can manage incidents for their services" ON public.incidents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE services.id = incidents.service_id
      AND services.user_id = auth.uid()
    )
  );

