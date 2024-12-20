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
} from '@mui/material';

interface HistoryEntry {
  action: string;
  createdAt: string;
}

interface RecentHistoryProps {
  history: HistoryEntry[];
}

const RecentHistory: React.FC<RecentHistoryProps> = ({ history }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Historique récent
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  Aucun historique récent
                </TableCell>
              </TableRow>
            ) : (
              history.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.action}</TableCell>
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
