-- ============================================
-- DONNÉES INITIALES - CHECKLIST ITEMS
-- ============================================

-- PHASE 1: AVANT LE CULTE
INSERT INTO public.checklist_items (phase, label, display_order) VALUES
('before_service', 'Allumer l''ampli principal', 1),
('before_service', 'Allumer la console de mixage', 2),
('before_service', 'Allumer les retours de scène', 3),
('before_service', 'Allumer les enceintes principales', 4),
('before_service', 'Vérifier tous les micros (chant, prédication)', 5),
('before_service', 'Vérifier les micros HF (sans fil)', 6),
('before_service', 'Tester les instruments (guitare, clavier, batterie)', 7),
('before_service', 'Régler les niveaux de base', 8),
('before_service', 'Faire un soundcheck avec l''équipe de louange', 9),
('before_service', 'Vérifier l''absence de larsen', 10),
('before_service', 'Tester l''enregistrement (si applicable)', 11),
('before_service', 'Vérifier le retour du prédicateur', 12);

-- PHASE 2: PENDANT LE CULTE
INSERT INTO public.checklist_items (phase, label, display_order) VALUES
('during_service', 'Surveiller les niveaux sonores', 1),
('during_service', 'Ajuster les micros en temps réel', 2),
('during_service', 'Gérer les transitions (louange/prédication)', 3),
('during_service', 'Noter les incidents techniques', 4),
('during_service', 'Surveiller les retours de scène', 5);

-- PHASE 3: APRÈS LE CULTE
INSERT INTO public.checklist_items (phase, label, display_order) VALUES
('after_service', 'Éteindre les enceintes principales', 1),
('after_service', 'Éteindre les retours de scène', 2),
('after_service', 'Éteindre la console de mixage', 3),
('after_service', 'Éteindre l''ampli principal', 4),
('after_service', 'Ranger les câbles et micros', 5),
('after_service', 'Vérifier que tout le matériel est éteint', 6),
('after_service', 'Valider le service dans l''application', 7);

