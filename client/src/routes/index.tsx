import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import ProductsPage from '../pages/ProductsPage';
import BrandsPage from '../pages/BrandsPage';
import BrandDetailsPage from '../pages/BandDetailsPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import CategoriesPage from '../pages/CategoriesPage';
import TagsPage from '../pages/TagsPage';

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
    path: '/products/:id',
    element: (
      <MainLayout isAdmin={true}>
        <ProductDetailsPage />
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
  {
    path: '/brands/:id',
    element: (
      <MainLayout isAdmin={true}>
        <BrandDetailsPage />
      </MainLayout>
    ),
  },
  {
    path: '/categories',
    element: (
      <MainLayout isAdmin={true}>
        <CategoriesPage />
      </MainLayout>
    ),
  },
  {
    path: '/tags',
    element: (
      <MainLayout isAdmin={true}>
        <TagsPage />
      </MainLayout>
    ),
  },
]);

export default router;
