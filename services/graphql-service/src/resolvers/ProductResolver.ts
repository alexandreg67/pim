import { Resolver, Query } from 'type-graphql';
import { Products } from '../entities/Products';

@Resolver(Products)
export default class ProductsResolver {
  @Query(() => [Products])
  async products(): Promise<Products[]> {
    try {
      // Utilisation de TypeORM pour récupérer tous les produits
      return await Products.find();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Unable to fetch products');
    }
  }
}
