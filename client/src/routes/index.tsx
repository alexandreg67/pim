import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import ProductsPage from '../pages/ProductsPage';

const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: (
      <MainLayout isAdmin={true}>
        <Dashboard />
      </MainLayout>
    ),
  },
  {
    path: '/products',
    element: (
      <MainLayout isAdmin={true}>
        <ProductsPage />
      </MainLayout>
    ),
  },
]);

export default router;
