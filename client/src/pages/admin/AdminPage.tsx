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
      {value === index && children}
    </div>
  );
};

const AdminPage = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Administration
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="admin tabs"
          sx={{
            borderColor: 'divider',
          }}
        >
          <Tab label="Créer un utilisateur" />
          <Tab label="Gérer les utilisateurs" />
        </Tabs>
      </Paper>

      <TabPanel value={currentTab} index={0}>
        <UserCreationForm />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <UsersList />
      </TabPanel>
    </Box>
  );
};

export default AdminPage;
