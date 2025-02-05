import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  Business as BusinessIcon,
  AdminPanelSettings,
} from '@mui/icons-material';

export const menuItemsAdmin = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  {
    text: 'Catalogue',
    icon: <InventoryIcon />,
    children: [
      { text: 'Liste des produits', path: '/products' },
      { text: 'Créer un produit', path: '/products/create' },
      { text: 'Catégories', path: '/categories' },
      { text: 'Tags', path: '/tags' },
      { text: 'Caractéristiques', path: '/characteristics' },
    ],
  },
  {
    text: 'Marques',
    icon: <BusinessIcon />,
    children: [
      { text: 'Liste des marques', path: '/brands' },
      { text: 'Contacts', path: '/brands/contacts' },
    ],
  },
  { text: 'Historique', icon: <CategoryIcon />, path: '/history' },
  { text: 'Administration', icon: <AdminPanelSettings />, path: '/admin' },
];

export const menuItemsCollaborator = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  {
    text: 'Catalogue',
    icon: <InventoryIcon />,
    children: [
      { text: 'Liste des produits', path: '/products' },
      { text: 'Créer un produit', path: '/products/create' },
    ],
  },
  { text: 'Marques', icon: <BusinessIcon />, path: '/brands' },
];
