import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface SearchBarProps {
  onSearch: (query: string) => void; // Fonction déclenchée lorsque l'utilisateur valide
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêche le rechargement de la page
    if (searchInput.trim()) {
      onSearch(searchInput); // Appelle la fonction de recherche
      setSearchInput(''); // Réinitialise l'input
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <TextField
        variant="outlined"
        size="small"
        placeholder="Rechercher un produit (nom ou référence)"
        fullWidth
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        sx={{ width: 400, mr: 48 }}
      />
    </form>
  );
};

export default SearchBar;
