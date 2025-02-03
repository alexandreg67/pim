import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Tooltip,
  Pagination,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from '../../generated/graphql-types';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '../../hooks/useDialog';
import { useNotification } from '../../hooks/useNotification';
import { ProductStatus } from '../../types/enum/product';
import { getStatusLabel } from '../../utils/product.utils';

interface ProductTableViewProps {
  searchQuery?: string;
  status?: string;
}

const ProductTableView: React.FC<ProductTableViewProps> = ({
  searchQuery,
  status,
}) => {
  const navigate = useNavigate();
  const { confirmDelete } = useDialog();
  const { success, error: showError } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch des produits avec pagination
  const { data, loading, error, refetch } = useGetProductsQuery({
    variables: {
      page: currentPage,
      limit: itemsPerPage,
      query: searchQuery,
      status: status,
    },
    fetchPolicy: 'network-only', // Toujours récupérer les nouvelles données
    notifyOnNetworkStatusChange: true,
  });

  const [deleteProduct, { loading: deleteLoading }] = useDeleteProductMutation({
    onCompleted: () => {
      success('Produit supprimé avec succès');
      refetch();
    },
    onError: (error) => {
      showError(`Erreur lors de la suppression : ${error.message}`);
    },
  });

  // Changement de page
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  // Suppression d'un produit
  const handleDeleteClick = async (id: string, name: string) => {
    const confirmed = await confirmDelete(`le produit "${name}"`);
    if (confirmed) {
      await deleteProduct({ variables: { id } });
    }
  };

  if (loading)
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  if (error)
    return <Typography color="error">Erreur : {error.message}</Typography>;

  const products = data?.products?.items || [];
  const totalProducts = data?.products?.total || 0;

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Référence</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Marque</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Catégories</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.reference}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.brand?.name || 'Aucune marque'}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(parseFloat(product.price))}
                </TableCell>
                <TableCell>
                  {getStatusLabel(product.status as ProductStatus)}
                </TableCell>
                <TableCell>
                  {product.categories
                    .map((category) => category.name)
                    .join(', ')}
                </TableCell>
                <TableCell>
                  {product.tags.map((tag) => tag.name).join(', ')}
                </TableCell>
                <TableCell>
                  <Tooltip title="Éditer">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/products/${product.id}/edit`)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleDeleteClick(product.id, product.name)
                      }
                      color="error"
                      disabled={deleteLoading}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
        <Pagination
          count={Math.ceil(totalProducts / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ProductTableView;
