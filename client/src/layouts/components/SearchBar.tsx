import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';

const SearchBar: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchInput.trim()) {
      // Redirige vers la page des produits avec le paramètre de recherche
      navigate(`/products?query=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit}>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Rechercher un produit (nom ou référence)"
        fullWidth
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        sx={{ width: 400, mr: 2 }}
      />
    </form>
  );
};

export default SearchBar;
