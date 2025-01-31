import React, { useState, useCallback } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from '../../generated/graphql-types';
import { ProductStatus } from '../../types/enum/product';
import { getStatusLabel } from '../../utils/product.utils';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '../../hooks/useDialog';
import { useNotification } from '../../hooks/useNotification';

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

  // Queries et Mutations
  const { data, loading, error, refetch } = useGetProductsQuery({
    variables: {
      page: 1,
      limit: itemsPerPage,
      query: searchQuery,
      status: status,
    },
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

  // Gestion de la pagination
  const handlePaginationModelChange = useCallback(
    async (newModel: GridPaginationModel) => {
      const newPage = newModel.page + 1;
      setCurrentPage(newPage);

      try {
        await refetch({
          page: newPage,
          limit: itemsPerPage,
          query: searchQuery,
          status: status,
        });
      } catch (error) {
        console.error('Error fetching more products:', error);
      }
    },
    [refetch, searchQuery, status, itemsPerPage]
  );

  // Actions
  const handleEditClick = (id: string) => () => {
    navigate(`/products/${id}/edit`);
  };

  const handleDeleteClick = async (id: string, name: string) => {
    try {
      const confirmed = await confirmDelete(`le produit "${name}"`);
      if (confirmed) {
        await deleteProduct({
          variables: { id },
        });
      }
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'reference',
      headerName: 'Référence',
      flex: 0.7,
    },
    {
      field: 'name',
      headerName: 'Nom',
      flex: 1,
    },
    {
      field: 'brand',
      headerName: 'Marque',
      flex: 0.8,
      valueGetter: (params) => params.row.brand?.name || 'Aucune marque',
    },
    {
      field: 'price',
      headerName: 'Prix',
      flex: 0.5,
      type: 'number',
      valueFormatter: (params) =>
        new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
        }).format(parseFloat(params.value)),
    },
    {
      field: 'status',
      headerName: 'Statut',
      flex: 0.6,
      valueFormatter: (params) => getStatusLabel(params.value as ProductStatus),
    },
    {
      field: 'categories',
      headerName: 'Catégories',
      flex: 1,
      valueGetter: (params) =>
        params.row.categories
          ?.map((cat: { name: string }) => cat.name)
          .join(', ') || '',
    },
    {
      field: 'tags',
      headerName: 'Tags',
      flex: 1,
      valueGetter: (params) =>
        params.row.tags?.map((tag: { name: string }) => tag.name).join(', ') ||
        '',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.3,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Éditer">
            <IconButton
              size="small"
              onClick={handleEditClick(params.row.id)}
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(params.row.id, params.row.name)}
              color="error"
              disabled={deleteLoading}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (error) return null;

  return (
    <Box
      sx={{
        width: '100%',
        '& .MuiDataGrid-root': {
          border: 'none',
        },
      }}
    >
      <DataGrid
        rows={data?.products?.items || []}
        columns={columns}
        paginationModel={{
          page: currentPage - 1,
          pageSize: itemsPerPage,
        }}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[12]}
        paginationMode="server"
        rowCount={data?.products?.total || 0}
        loading={loading || deleteLoading}
        checkboxSelection
        disableRowSelectionOnClick
        density="compact"
        getRowId={(row) => row.id}
        keepNonExistentRowsSelected
        autoHeight
        sx={{
          '& .MuiDataGrid-cell': {
            borderColor: 'divider',
          },
          '& .MuiDataGrid-row:last-child td': {
            borderBottom: 'none',
          },
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: itemsPerPage, page: 0 } },
        }}
      />
    </Box>
  );
};

export default ProductTableView;
