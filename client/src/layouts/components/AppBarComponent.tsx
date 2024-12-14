import {
  AppBar,
  Avatar,
  Badge,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import React from 'react';
import SearchBar from './SearchBar';

interface AppBarProps {
  user: { name: string };
  notificationsOpen: HTMLElement | null;
  onToggleDrawer: () => void;
  onNotificationsOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onNotificationsClose: () => void;
  onSearch: (query: string) => void;
}

export const AppBarComponent: React.FC<AppBarProps> = ({
  user,
  notificationsOpen,
  onToggleDrawer,
  onNotificationsOpen,
  onNotificationsClose,
  onSearch,
}) => {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onToggleDrawer}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap>
            PIM Platform
          </Typography>
        </Box>

        <Box
          sx={{ flexGrow: 1, display: 'flex', justifyContent: 'start', ml: 15 }}
        >
          <SearchBar onSearch={onSearch} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};
