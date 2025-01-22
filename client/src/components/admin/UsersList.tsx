// src/components/admin/UsersList.tsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  TablePagination,
  CircularProgress,
  Box,
} from '@mui/material';
import { Edit, Block, CheckCircle } from '@mui/icons-material';
import { format } from 'date-fns';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  startDate: string;
  endDate?: string;
  isFirstLogin: boolean;
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/auth/users?page=${page + 1}&limit=${rowsPerPage}`
      );
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper className="w-full">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === 'admin' ? 'secondary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(user.startDate), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  {user.endDate
                    ? format(new Date(user.endDate), 'dd/MM/yyyy')
                    : '-'}
                </TableCell>
                <TableCell>
                  {user.isFirstLogin ? (
                    <Chip
                      label="Pending"
                      color="warning"
                      size="small"
                      icon={<Block />}
                    />
                  ) : (
                    <Chip
                      label="Active"
                      color="success"
                      size="small"
                      icon={<CheckCircle />}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton size="small">
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={user.isFirstLogin ? 'Activate' : 'Disable'}>
                    <IconButton size="small">
                      {user.isFirstLogin ? (
                        <CheckCircle fontSize="small" color="success" />
                      ) : (
                        <Block fontSize="small" color="error" />
                      )}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={-1}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
};

export default UsersList;
