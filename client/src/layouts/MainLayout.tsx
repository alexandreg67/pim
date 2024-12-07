import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { AppBarComponent } from './components/AppBarComponent';
import { DrawerComponent } from './components/DrawerComponent';
import { menuItemsAdmin, menuItemsCollaborator } from './constants/constants';

const MainLayout = ({
  children,
  isAdmin,
}: {
  children: React.ReactNode;
  isAdmin: boolean;
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState<HTMLElement | null>(null);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) =>
    setNotificationsOpen(event.currentTarget);
  const handleNotificationsClose = () => setNotificationsOpen(null);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarComponent
        user={{ name: 'John Doe' }}
        notificationsOpen={notificationsOpen}
        onToggleDrawer={handleDrawerToggle}
        onNotificationsOpen={handleNotificationsOpen}
        onNotificationsClose={handleNotificationsClose}
      />
      <DrawerComponent
        isAdmin={isAdmin}
        menuItems={isAdmin ? menuItemsAdmin : menuItemsCollaborator}
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px' }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
