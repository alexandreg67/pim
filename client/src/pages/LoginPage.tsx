import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/slices/authSlice';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.info('Login error:', err);
      setError('Identifiants invalides');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              PIM Platform
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Connexion à votre espace
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {error && (
              <Box sx={{ mb: 3 }}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mb: 2 }}
            >
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
