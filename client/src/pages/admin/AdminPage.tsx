import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography, Paper } from '@mui/material';
import UserCreationForm from '../../components/admin/UserCreationForm';
import UsersList from '../../components/admin/UsersList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </Box>
  );
};

const AdminPage = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ height: '100%' }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 500 }}>
          Administration
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="admin tabs"
          >
            <Tab
              label="Liste des utilisateurs"
              id="admin-tab-0"
              aria-controls="admin-tabpanel-0"
            />
            <Tab
              label="Créer un utilisateur"
              id="admin-tab-1"
              aria-controls="admin-tabpanel-1"
            />
          </Tabs>
        </Box>
      </Paper>

      <TabPanel value={currentTab} index={0}>
        <UsersList />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <UserCreationForm />
      </TabPanel>
    </Box>
  );
};

export default AdminPage;
