import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { AppBarComponent } from './components/AppBarComponent';
import { DrawerComponent } from './components/DrawerComponent';
import { menuItemsAdmin, menuItemsCollaborator } from './constants/constants';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState<HTMLElement | null>(null);
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) =>
    setNotificationsOpen(event.currentTarget);
  const handleNotificationsClose = () => setNotificationsOpen(null);

  const handleSearch = (query: string) => {
    navigate(`/products?query=${encodeURIComponent(query)}`);
  };

  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarComponent
        user={user}
        notificationsOpen={notificationsOpen}
        onToggleDrawer={handleDrawerToggle}
        onNotificationsOpen={handleNotificationsOpen}
        onNotificationsClose={handleNotificationsClose}
        onSearch={handleSearch}
      />
      <DrawerComponent
        isAdmin={isAdmin}
        menuItems={isAdmin ? menuItemsAdmin : menuItemsCollaborator}
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '64px',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 1,
            p: 2,
            minHeight: 'calc(100vh - 180px)',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
