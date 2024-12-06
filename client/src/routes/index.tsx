import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <div>Dashboard</div>
      </MainLayout>
    ),
  },
]);

export default router;
