-- Insertion des catégories
INSERT INTO categories (name, description) VALUES
('Ordinateurs portables', 'Ordinateurs transportables pour tous les usages'),
('Ordinateurs de bureau', 'Ordinateurs fixes pour un usage professionnel ou personnel'),
('Smartphones', 'Téléphones intelligents et accessoires'),
('Tablettes', 'Tablettes tactiles tous formats'),
('Objets connectés', 'Montres, bracelets et autres objets connectés'),
('Audio', 'Casques, écouteurs et enceintes'),
('Composants PC', 'Pièces et composants pour ordinateurs'),
('Périphériques', 'Claviers, souris et autres accessoires informatiques'),
('Gaming', 'Matériel spécialisé pour les jeux vidéo'),
('Réseaux', 'Équipements réseau et connectivité'),
('Mobilier', 'Meubles et articles d''ameublement pour la maison et le bureau'),
('Éclairage', 'Solutions d''éclairage intérieur et extérieur'),
('Textile', 'Articles textiles pour la maison'),
('Décoration', 'Articles décoratifs et accessoires'),
('Cuisine', 'Équipements et ustensiles de cuisine'),
('Salle de bain', 'Accessoires et mobilier de salle de bain'),
('Jardin', 'Mobilier et accessoires d''extérieur'),
('Rangement', 'Solutions de rangement et organisation'),
('Électroménager', 'Appareils électroménagers pour la maison'),
('Bureau', 'Mobilier et accessoires pour espace de travail')
ON CONFLICT (name) DO NOTHING;