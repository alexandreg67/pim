import React, { useState, useCallback } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useGetProductsQuery } from '../../generated/graphql-types';
import { ProductStatus } from '../../types/enum/product';
import { getStatusLabel } from '../../utils/product.utils';
import { useNavigate } from 'react-router-dom';

interface ProductTableViewProps {
  searchQuery?: string;
  status?: string;
}

const ProductTableView: React.FC<ProductTableViewProps> = ({
  searchQuery,
  status,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const itemsPerPage = 12;

  const { data, loading, error, fetchMore } = useGetProductsQuery({
    variables: {
      page: 1,
      limit: itemsPerPage,
      query: searchQuery,
      status: status,
    },
    notifyOnNetworkStatusChange: true,
  });

  const handlePaginationModelChange = useCallback(
    async (newModel: GridPaginationModel) => {
      const newPage = newModel.page + 1;
      setCurrentPage(newPage);

      try {
        await fetchMore({
          variables: {
            page: newPage,
            limit: itemsPerPage,
            query: searchQuery,
            status: status,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return fetchMoreResult;
          },
        });
      } catch (error) {
        console.error('Error fetching more products:', error);
      }
    },
    [fetchMore, searchQuery, status, itemsPerPage]
  );

  const handleEditClick = (id: string) => () => {
    navigate(`/products/${id}/edit`);
  };

  const handleDeleteClick = (id: string, name: string) => () => {
    setProductToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        // TODO: Implémenter la mutation de suppression
        console.info('Suppression du produit:', productToDelete.id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
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
              onClick={handleDeleteClick(params.row.id, params.row.name)}
              color="error"
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
        loading={loading}
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le produit &quot;
            {productToDelete?.name}&quot; ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductTableView;
