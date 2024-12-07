import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout isAdmin={true}>
        <Dashboard />
      </MainLayout>
    ),
  },
]);

export default router;
