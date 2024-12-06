import { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  TextField,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Category,
  Inventory,
  Business,
  Person,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const menuItemsAdmin = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Catégories', icon: <Category />, path: '/categories' },
  { text: 'Produits', icon: <Inventory />, path: '/products' },
  { text: 'Marques', icon: <Business />, path: '/brands' },
  { text: 'Tags', icon: <Category />, path: '/tags' },
  { text: 'Caractéristiques', icon: <Category />, path: '/characteristics' },
  { text: 'Historique', icon: <Category />, path: '/history' },
];

const menuItemsCollaborator = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Produits', icon: <Inventory />, path: '/products' },
  { text: 'Profil', icon: <Person />, path: '/profile' },
];

const MainLayout = ({
  children,
  isAdmin = true,
  // user,
}: {
  children: React.ReactNode;
  isAdmin: boolean;
  user: { name: string };
}) => {
  const user = {
    id: 'user123',
    name: 'John Doe',
    role: 'admin', // ou 'collaborator'
  };

  // const notifications = [
  //   { id: 1, message: 'Nouvelle réponse de la marque A' },
  //   { id: 2, message: 'Produit X en attente de validation' },
  //   { id: 3, message: 'Marque Y a répondu à votre demande' },
  // ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsOpen(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsOpen(null);
  };

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <List>
        {(isAdmin ? menuItemsAdmin : menuItemsCollaborator).map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* Footer dans le Drawer */}
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
        <Typography variant="caption">Version 1.0.0</Typography>
        <Typography variant="caption">Support : support@example.com</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Navbar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {/* Bouton pour ouvrir le drawer sur mobile */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          {/* Titre de la plateforme */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            PIM Platform
          </Typography>
          {/* Barre de recherche globale */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Rechercher un produit (nom ou référence)"
            sx={{ width: 300, mr: 2 }}
          />
          {/* Notifications */}
          <IconButton color="inherit" onClick={handleNotificationsOpen}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={notificationsOpen}
            open={Boolean(notificationsOpen)}
            onClose={handleNotificationsClose}
          >
            <MenuItem>Nouvelle réponse de la marque A</MenuItem>
            <MenuItem>Produit X en attente de validation</MenuItem>
            <MenuItem>Marque Y a répondu à votre demande</MenuItem>
          </Menu>
          {/* Nom de l'utilisateur */}
          <Typography variant="body2" sx={{ mx: 2 }}>
            Bonjour, {user.name}
          </Typography>
          {/* Avatar utilisateur */}
          <Avatar alt={user.name} src="/path/to/avatar.jpg" />
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Drawer mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Drawer desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              mt: '64px',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '64px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
