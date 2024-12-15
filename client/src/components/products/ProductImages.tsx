import React, { useState } from 'react';
import { Box, Typography, Card, CardMedia, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Image {
  id: string;
  url: string; // Nom de l'image récupérée depuis la base
  altText?: string;
  isPrimary: boolean;
}

const ProductImages: React.FC<{ images: Image[] }> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(
    images.findIndex((img) => img.isPrimary) || 0
  );

  const [invalidImageIndexes, setInvalidImageIndexes] = useState<number[]>([]); // Liste des images non valides

  const handleNext = () => {
    let nextIndex = (currentImageIndex + 1) % images.length;
    while (invalidImageIndexes.includes(nextIndex)) {
      nextIndex = (nextIndex + 1) % images.length; // Sauter les images invalides
    }
    setCurrentImageIndex(nextIndex);
  };

  const handlePrev = () => {
    let prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    while (invalidImageIndexes.includes(prevIndex)) {
      prevIndex = (prevIndex - 1 + images.length) % images.length; // Sauter les images invalides
    }
    setCurrentImageIndex(prevIndex);
  };

  const handleImageError = (index: number) => {
    setInvalidImageIndexes((prev) => [...prev, index]);
  };

  if (!images || images.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        <Typography>Aucune image disponible pour ce produit.</Typography>
      </Box>
    );
  }

  const validImages = images.filter(
    (_, index) => !invalidImageIndexes.includes(index)
  );

  if (validImages.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        <Typography>Aucune image valide disponible pour ce produit.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', marginBottom: 4 }}>
      <Card>
        <CardMedia
          component="img"
          image={`http://localhost:8000/images/${images[currentImageIndex].url}`}
          alt={
            images[currentImageIndex].altText ||
            `Image ${currentImageIndex + 1}`
          }
          onError={() => handleImageError(currentImageIndex)} // Marquer l'image comme invalide
          sx={{ height: 400, objectFit: 'contain' }}
        />
      </Card>

      {validImages.length > 1 && (
        <>
          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              left: 10,
              transform: 'translateY(-50%)',
              zIndex: 10,
            }}
            onClick={handlePrev}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              right: 10,
              transform: 'translateY(-50%)',
              zIndex: 10,
            }}
            onClick={handleNext}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </>
      )}

      {validImages.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          {validImages.map((img, index) => (
            <Box
              key={img.id}
              sx={{
                border:
                  index === currentImageIndex
                    ? '2px solid #1976d2'
                    : '2px solid transparent',
                padding: '2px',
                cursor: 'pointer',
                marginRight: 1,
              }}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img
                src={`http://localhost:8000/images/${img.url}`}
                alt={img.altText || `Miniature ${index + 1}`}
                onError={() => handleImageError(index)} // Marquer la miniature comme invalide
                style={{ height: 50, objectFit: 'contain' }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProductImages;
