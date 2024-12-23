INSERT INTO actions (name, description, type, active) VALUES 
-- Produits
('CREATE_PRODUCT', 'Création d''un nouveau produit', 'PRODUCT', true),
('UPDATE_PRODUCT', 'Modification des informations d''un produit', 'PRODUCT', true),
('DELETE_PRODUCT', 'Suppression d''un produit', 'PRODUCT', true),
('ARCHIVE_PRODUCT', 'Archivage d''un produit', 'PRODUCT', true),
('RESTORE_PRODUCT', 'Restauration d''un produit archivé', 'PRODUCT', true),
('DUPLICATE_PRODUCT', 'Duplication d''un produit existant', 'PRODUCT', true),

-- Médias
('ADD_IMAGE', 'Ajout d''une image au produit', 'MEDIA', true),
('REMOVE_IMAGE', 'Suppression d''une image du produit', 'MEDIA', true),
('SET_MAIN_IMAGE', 'Définition de l''image principale', 'MEDIA', true),
('REORDER_IMAGES', 'Réorganisation des images du produit', 'MEDIA', true),

-- Caractéristiques
('ADD_CHARACTERISTIC', 'Ajout d''une caractéristique au produit', 'CHARACTERISTIC', true),
('UPDATE_CHARACTERISTIC', 'Modification d''une caractéristique', 'CHARACTERISTIC', true),
('REMOVE_CHARACTERISTIC', 'Suppression d''une caractéristique', 'CHARACTERISTIC', true),

-- Catégories
('ADD_CATEGORY', 'Association d''une catégorie au produit', 'CATEGORY', true),
('REMOVE_CATEGORY', 'Dissociation d''une catégorie du produit', 'CATEGORY', true),

-- Tags
('ADD_TAG', 'Ajout d''un tag au produit', 'TAG', true),
('REMOVE_TAG', 'Suppression d''un tag du produit', 'TAG', true),

-- Workflow
('SUBMIT_FOR_REVIEW', 'Soumission du produit pour révision', 'WORKFLOW', true),
('APPROVE_PRODUCT', 'Approbation du produit', 'WORKFLOW', true),
('REJECT_PRODUCT', 'Rejet du produit', 'WORKFLOW', true),
('PUBLISH_PRODUCT', 'Publication du produit', 'WORKFLOW', true),
('UNPUBLISH_PRODUCT', 'Dépublication du produit', 'WORKFLOW', true)
ON CONFLICT (name) DO NOTHING;