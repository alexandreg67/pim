import { Resolver, Query, Arg, Int, ObjectType, Field } from 'type-graphql';
import { Products } from '../entities/Products';
import { FindOptionsWhere, ILike } from 'typeorm';

@ObjectType()
class PaginatedProductsResponse {
  @Field(() => [Products])
  items: Products[];

  @Field()
  total: number;

  @Field()
  hasMore: boolean;
}

@Resolver(Products)
export default class ProductsResolver {
  @Query(() => PaginatedProductsResponse)
  async products(
    @Arg('page', () => Int, { defaultValue: 1 }) page: number,
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number,
    @Arg('query', () => String, { nullable: true }) query?: string,
    @Arg('status', () => String, { nullable: true }) status?: string
  ): Promise<PaginatedProductsResponse> {
    try {
      const offset = (page - 1) * limit;

      const where: FindOptionsWhere<Products> = {};

      if (status) {
        where.status = status;
      }

      if (query) {
        where.name = ILike(`%${query}%`);
      }

      const [items, total] = await Products.findAndCount({
        where,
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: {
          brand: true,
        },
      });

      return {
        items,
        total,
        hasMore: total > offset + items.length,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Unable to fetch products');
    }
  }

  // Query pour les suggestions de recherche (autocomplétion)
  @Query(() => [Products])
  async searchProductsSuggestions(
    @Arg('query') query: string,
    @Arg('limit', () => Int, { defaultValue: 5 }) limit: number
  ): Promise<Products[]> {
    try {
      return await Products.createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand')
        .where(`product.search_vector @@ plainto_tsquery('french', :query)`, {
          query,
        })
        .orderBy(
          `ts_rank(product.search_vector, plainto_tsquery('french', :query))`,
          'DESC'
        )
        .take(limit)
        .getMany();
    } catch (error) {
      console.error('Error fetching product suggestions:', error);
      throw new Error('Unable to fetch product suggestions');
    }
  }

  @Query(() => Products, { nullable: true })
  async product(@Arg('id', () => String) id: string): Promise<Products | null> {
    try {
      const product = await Products.findOne({
        where: { id },
        relations: [
          'brand',
          'productCharacteristics',
          'productCharacteristics.characteristic',
          'images',
          'categories',
          'tags',
          'contact',
        ],
      });

      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }

      return product;
    } catch (error) {
      console.error(`❌ Error fetching product by ID: ${error}`);
      throw new Error('Unable to fetch product');
    }
  }
}
