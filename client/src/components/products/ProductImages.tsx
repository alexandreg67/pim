import React, { useState } from 'react';
import { Box, Typography, Card, CardMedia, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Image {
  id: string;
  url: string | null; // URL peut être null ou manquant
  altText?: string;
  isPrimary: boolean;
}

const ProductImages: React.FC<{ images: Image[] }> = ({ images }) => {
  // Filtrer uniquement les images valides
  const validImages = images.filter((img) => img && img.url);

  const [currentImageIndex, setCurrentImageIndex] = useState(() => {
    const primaryIndex = validImages.findIndex((img) => img.isPrimary);
    return primaryIndex >= 0 ? primaryIndex : 0;
  });

  if (!validImages || validImages.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        <Typography variant="h6">
          Aucune image disponible pour ce produit
        </Typography>
      </Box>
    );
  }

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % validImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + validImages.length) % validImages.length
    );
  };

  return (
    <Box sx={{ position: 'relative', marginBottom: 4 }}>
      <Card>
        <CardMedia
          component="img"
          image={`http://localhost:8000/images/${validImages[currentImageIndex].url}`}
          alt={validImages[currentImageIndex].altText || `Image du produit`}
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
