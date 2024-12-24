import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
} from '@mui/material';

interface Action {
  description: string;
  name: string;
  type: string;
}

interface HistoryEntry {
  action: Action;
  createdAt: Date;
  user: {
    firstName: string;
    lastName: string;
  };
  product: {
    name: string;
    reference: string;
  };
}
interface RecentHistoryProps {
  history: HistoryEntry[];
}

const RecentHistory: React.FC<RecentHistoryProps> = ({ history }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Historique récent
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Description</strong>
              </TableCell>
              <TableCell>
                <strong>Type</strong>
              </TableCell>
              <TableCell>
                <strong>Utilisateur</strong>
              </TableCell>
              <TableCell>
                <strong>Produit</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Date</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Aucun historique récent
                </TableCell>
              </TableRow>
            ) : (
              history.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {entry.action.description || 'Aucune description'}
                  </TableCell>
                  <TableCell>{entry.action.type}</TableCell>
                  <TableCell>
                    {entry.user
                      ? `${entry.user.firstName} ${entry.user.lastName}`
                      : 'Utilisateur inconnu'}
                  </TableCell>
                  <TableCell>
                    {entry.product
                      ? `${entry.product.name} (Réf: ${entry.product.reference})`
                      : 'Produit inconnu'}
                  </TableCell>
                  <TableCell align="right">
                    {new Date(entry.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RecentHistory;
