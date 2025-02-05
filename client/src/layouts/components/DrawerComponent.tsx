import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  children?: Array<{
    text: string;
    path: string;
  }>;
}

interface DrawerProps {
  isAdmin: boolean;
  menuItems: MenuItem[];
  mobileOpen: boolean;
  onClose: () => void;
}

export const DrawerComponent: React.FC<DrawerProps> = ({
  menuItems,
  mobileOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      setExpandedItems((prev) =>
        prev.includes(item.text)
          ? prev.filter((i) => i !== item.text)
          : [...prev, item.text]
      );
    } else if (item.path) {
      navigate(item.path);
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ mt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleItemClick(item)}
                selected={item.path === location.pathname}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.children &&
                  (expandedItems.includes(item.text) ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  ))}
              </ListItemButton>
            </ListItem>

            {item.children && (
              <Collapse in={expandedItems.includes(item.text)}>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.path}
                      onClick={() => {
                        navigate(child.path);
                        onClose();
                      }}
                      sx={{ pl: 4 }}
                      selected={child.path === location.pathname}
                    >
                      <ListItemText primary={child.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
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
