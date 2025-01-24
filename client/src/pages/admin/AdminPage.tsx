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
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const AdminPage = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4">Administration</Typography>
      </Box>
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="admin tabs"
        >
          <Tab label="Liste des utilisateurs" />
          <Tab label="Créer un utilisateur" />
        </Tabs>
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
