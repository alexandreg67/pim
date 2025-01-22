import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import ProductsPage from '../pages/ProductsPage';
import BrandsPage from '../pages/BrandsPage';
import BrandDetailsPage from '../pages/BandDetailsPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import CategoriesPage from '../pages/CategoriesPage';
import TagsPage from '../pages/TagsPage';
import EditProductPage from '../pages/EditProductPage';
import AdminPage from '../pages/admin/AdminPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout isAdmin={true} />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'admin',
        element: <AdminPage />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'products',
        children: [
          {
            index: true,
            element: <ProductsPage />,
          },
          {
            path: ':id',
            element: <ProductDetailsPage />,
          },
          {
            path: ':id/edit',
            element: <EditProductPage />,
          },
        ],
      },
      {
        path: 'brands',
        children: [
          {
            index: true,
            element: <BrandsPage />,
          },
          {
            path: ':id',
            element: <BrandDetailsPage />,
          },
        ],
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'tags',
        element: <TagsPage />,
      },
    ],
  },
]);

export default router;
