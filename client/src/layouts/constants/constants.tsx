import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  AdminPanelSettings,
} from '@mui/icons-material';

export const menuItemsAdmin = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Produits', icon: <InventoryIcon />, path: '/products' },
  { text: 'Marques', icon: <BusinessIcon />, path: '/brands' },
  { text: 'Catégories', icon: <CategoryIcon />, path: '/categories' },
  { text: 'Tags', icon: <CategoryIcon />, path: '/tags' },
  {
    text: 'Caractéristiques',
    icon: <CategoryIcon />,
    path: '/characteristics',
  },
  { text: 'Historique', icon: <CategoryIcon />, path: '/history' },
  {
    text: 'Administration',
    icon: <AdminPanelSettings />,
    path: '/admin',
  },
];

export const menuItemsCollaborator = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Produits', icon: <InventoryIcon />, path: '/products' },
  { text: 'Profil', icon: <PersonIcon />, path: '/profile' },
];
