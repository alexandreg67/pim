import { Resolver, Query, Arg, Int, ObjectType, Field } from 'type-graphql';
import { ILike } from 'typeorm';
import { Products } from '../entities/Products';

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
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number
  ): Promise<PaginatedProductsResponse> {
    try {
      const offset = (page - 1) * limit;

      const [items, total] = await Products.findAndCount({
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: {
          brand: true,
          productCharacteristics: {
            characteristic: true,
          },
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

  @Query(() => PaginatedProductsResponse)
  async searchProducts(
    @Arg('query') query: string,
    @Arg('page', () => Int, { defaultValue: 1 }) page: number,
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number
  ): Promise<PaginatedProductsResponse> {
    try {
      const offset = (page - 1) * limit;

      console.info('🔍 Searching for:', query);

      // Créez la requête avec le bon alias et les jointures
      const queryBuilder = Products.createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.productCharacteristics', 'characteristics')
        .leftJoinAndSelect('characteristics.characteristic', 'definition')
        .where(`product.search_vector @@ to_tsquery('french', :queryText)`, {
          queryText: query.split(' ').join(' & '),
        })
        .addSelect(
          `ts_rank(product.search_vector, to_tsquery('french', :queryText))`,
          'rank'
        )
        .orderBy('rank', 'DESC')
        .addOrderBy('product.createdAt', 'DESC')
        .skip(offset)
        .take(limit);

      const [items, total] = await queryBuilder.getManyAndCount();

      // Si pas de résultats, on fait un fallback sur LIKE
      if (total === 0) {
        console.info('⚠️ No results with full-text search, trying LIKE');
        const [fallbackItems, fallbackTotal] = await Products.findAndCount({
          where: [
            { name: ILike(`%${query}%`) },
            { reference: ILike(`%${query}%`) },
          ],
          skip: offset,
          take: limit,
          order: { createdAt: 'DESC' },
          relations: {
            brand: true,
            productCharacteristics: {
              characteristic: true,
            },
          },
        });

        return {
          items: fallbackItems,
          total: fallbackTotal,
          hasMore: fallbackTotal > offset + fallbackItems.length,
        };
      }

      console.info(`✨ Found ${total} results with full-text search`);
      return {
        items,
        total,
        hasMore: total > offset + items.length,
      };
    } catch (error) {
      console.error('❌ Error searching products:', error);
      throw new Error(`Unable to search products: ${error}`);
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
}
