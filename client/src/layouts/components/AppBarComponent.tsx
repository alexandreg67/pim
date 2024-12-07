import {
  AppBar,
  Avatar,
  Badge,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import React from 'react';

interface AppBarProps {
  user: { name: string };
  notificationsOpen: HTMLElement | null;
  onToggleDrawer: () => void;
  onNotificationsOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onNotificationsClose: () => void;
}

export const AppBarComponent: React.FC<AppBarProps> = ({
  user,
  notificationsOpen,
  onToggleDrawer,
  onNotificationsOpen,
  onNotificationsClose,
}) => {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onToggleDrawer}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          PIM Platform
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Rechercher un produit (nom ou référence)"
          sx={{ width: 300, mr: 2 }}
        />
        <IconButton color="inherit" onClick={onNotificationsOpen}>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={notificationsOpen}
          open={Boolean(notificationsOpen)}
          onClose={onNotificationsClose}
        >
          <MenuItem>Nouvelle réponse de la marque A</MenuItem>
          <MenuItem>Produit X en attente de validation</MenuItem>
          <MenuItem>Marque Y a répondu à votre demande</MenuItem>
        </Menu>
        <Typography variant="body2" sx={{ mx: 2 }}>
          Bonjour, {user.name}
        </Typography>
        <Avatar alt={user.name} src="/path/to/avatar.jpg" />
      </Toolbar>
    </AppBar>
  );
};
