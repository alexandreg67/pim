import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import ProductsPage from '../pages/ProductsPage';
import BrandsPage from '../pages/BrandsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout isAdmin={true}>
        <Dashboard />
      </MainLayout>
    ),
  },
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
  {
    path: '/brands',
    element: (
      <MainLayout isAdmin={true}>
        <BrandsPage />
      </MainLayout>
    ),
  },
]);

export default router;
