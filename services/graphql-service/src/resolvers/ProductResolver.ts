import { Resolver, Query, Arg, Int } from 'type-graphql';
import { Products } from '../entities/Products';

@Resolver(Products)
export default class ProductsResolver {
  @Query(() => [Products])
  async products(
    @Arg('page', () => Int, { defaultValue: 1 }) page: number,
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number
  ): Promise<Products[]> {
    try {
      const offset = (page - 1) * limit;
      return await Products.find({
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: ['brand'],
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Unable to fetch products');
    }
  }
}
