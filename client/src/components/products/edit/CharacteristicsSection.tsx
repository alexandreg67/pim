// src/components/products/edit/CharacteristicsSection.tsx
import { useState } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  TextField,
  IconButton,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { useNotification } from '../../../hooks/useNotification';
import {
  useAddProductCharacteristicMutation,
  useGetCharacteristicDefinitionsQuery,
  useRemoveProductCharacteristicMutation,
  useUpdateProductCharacteristicMutation,
} from '../../../generated/graphql-types';

export type CharacteristicType = {
  id: string;
  value: string;
  characteristic: {
    id: string;
    name: string;
  };
};

type CharacteristicsSectionProps = {
  productCharacteristics: CharacteristicType[];
  productId: string;
  onUpdate: () => void;
};

const CharacteristicsSection = ({
  productCharacteristics,
  productId,
  onUpdate,
}: CharacteristicsSectionProps) => {
  const [newCharacteristicId, setNewCharacteristicId] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const { success, error: showError } = useNotification();

  const { data: characteristicDefinitions } =
    useGetCharacteristicDefinitionsQuery();
  const [addCharacteristic] = useAddProductCharacteristicMutation();
  const [updateCharacteristic] = useUpdateProductCharacteristicMutation();
  const [removeCharacteristic] = useRemoveProductCharacteristicMutation();

  const handleAddCharacteristic = async () => {
    if (newCharacteristicId && newValue) {
      try {
        await addCharacteristic({
          variables: {
            productId,
            characteristicId: newCharacteristicId,
            value: newValue,
          },
        });
        success('Caractéristique ajoutée avec succès');
        setNewCharacteristicId('');
        setNewValue('');
        onUpdate();
      } catch (error) {
        console.error(error);
        showError("Erreur lors de l'ajout de la caractéristique");
      }
    }
  };

  const handleUpdateCharacteristic = async (
    characteristicId: string,
    value: string
  ) => {
    try {
      await updateCharacteristic({
        variables: {
          productId,
          characteristicId,
          value,
        },
      });
      success('Caractéristique mise à jour avec succès');
      onUpdate();
    } catch (error) {
      console.error(error);
      showError('Erreur lors de la mise à jour de la caractéristique');
    }
  };

  const handleRemoveCharacteristic = async (characteristicId: string) => {
    try {
      await removeCharacteristic({
        variables: {
          productId,
          characteristicId,
        },
      });
      success('Caractéristique supprimée avec succès');
      onUpdate();
    } catch (error) {
      console.error(error);
      showError('Erreur lors de la suppression de la caractéristique');
    }
  };

  const availableCharacteristics =
    characteristicDefinitions?.characteristicDefinitions.filter(
      (def) =>
        !productCharacteristics.some((pc) => pc.characteristic.id === def.id)
    ) || [];

  return (
    <Grid container spacing={3}>
      {productCharacteristics.map((char) => (
        <Grid item xs={12} key={char.characteristic.id}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle2" sx={{ minWidth: 200 }}>
                  {char.characteristic.name}
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  value={char.value}
                  onChange={(e) =>
                    handleUpdateCharacteristic(
                      char.characteristic.id,
                      e.target.value
                    )
                  }
                />
                <IconButton
                  color="error"
                  onClick={() =>
                    handleRemoveCharacteristic(char.characteristic.id)
                  }
                >
                  <Delete />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Caractéristique</InputLabel>
                  <Select
                    value={newCharacteristicId}
                    onChange={(e) => setNewCharacteristicId(e.target.value)}
                    label="Caractéristique"
                  >
                    {availableCharacteristics?.map((def) => (
                      <MenuItem key={def.id} value={def.id}>
                        {def.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Valeur"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddCharacteristic}
                  disabled={!newCharacteristicId || !newValue}
                >
                  Ajouter
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CharacteristicsSection;
