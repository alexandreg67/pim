import React, { useState } from 'react';
import { Box, Grid, Pagination } from '@mui/material';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
}

interface ProductListProps {
  products: Product[];
  itemsPerPage?: number;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  itemsPerPage = 12,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          {currentProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} xl={3} key={product.id}>
              <ProductCard
                name={product.name}
                brand={product.brand}
                price={product.price}
                stock={product.stock}
              />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
          <Pagination
            count={Math.ceil(products.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
    </>
  );
};

export default ProductList;
