import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DrawerProps {
  isAdmin: boolean;
  menuItems: { text: string; icon: React.ReactNode; path: string }[];
  mobileOpen: boolean;
  onClose: () => void;
}

export const DrawerComponent: React.FC<DrawerProps> = ({
  menuItems,
  mobileOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  const drawerContent = (
    <Box sx={{ mt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
        <Typography variant="caption">Version 1.0.0</Typography>
        <Typography variant="caption">Support : support@example.com</Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: 240 },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: 240, mt: '64px' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
