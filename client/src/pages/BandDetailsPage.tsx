import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from '@mui/material';
import { useGetBrandQuery } from '../generated/graphql-types';

const BrandDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data, loading, error, refetch } = useGetBrandQuery({
    variables: {
      brandId: id || '',
      contactLimit: rowsPerPage,
      contactOffset: page * rowsPerPage,
    },
    skip: !id,
  });

  if (!id) {
    return (
      <Typography color="error">Error: ID is missing from the URL.</Typography>
    );
  }

  if (loading) return <Typography>Loading...</Typography>;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  const brand = data?.brand;

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
    refetch({
      brandId: id || '',
      contactLimit: rowsPerPage,
      contactOffset: newPage * rowsPerPage,
    });
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    refetch({
      brandId: id || '',
      contactLimit: newRowsPerPage,
      contactOffset: 0,
    });
  };

  const drawerWidth = 240;

  return (
    <Box sx={{ marginLeft: { sm: `${drawerWidth}px` }, padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {brand?.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {brand?.description}
      </Typography>
      <img
        src={
          brand?.logo
            ? `http://localhost:8000/logos/${brand.logo}`
            : '/api/placeholder/200/200'
        }
        alt={brand?.name}
        style={{ height: 120, marginBottom: 20 }}
      />

      {/* Contacts Table */}
      <Typography variant="h5" gutterBottom>
        Contacts
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Pays</TableCell>
              <TableCell align="center">Produits associés</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brand?.contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.country}</TableCell>
                <TableCell align="center">
                  {
                    brand?.products?.filter((product) =>
                      product.name.includes(contact.country || '')
                    ).length
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={data?.brand?.totalContacts || 0} // Ajoute ce champ dans la requête GraphQL
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>
    </Box>
  );
};

export default BrandDetailsPage;
