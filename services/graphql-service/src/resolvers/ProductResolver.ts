import {
  Resolver,
  Query,
  Arg,
  Int,
  ObjectType,
  Field,
  Mutation,
  InputType,
} from 'type-graphql';
import { Products } from '../entities/Products';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { Categories } from '../entities/Categories';

@ObjectType()
class PaginatedProductsResponse {
  @Field(() => [Products])
  items: Products[];

  @Field()
  total: number;

  @Field()
  hasMore: boolean;
}

@InputType()
class UpdateProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  shortDescription?: string;

  @Field({ nullable: true })
  price?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  label?: string;

  // Relations
  @Field(() => [String], { nullable: true })
  categoryIds?: string[];

  @Field(() => [String], { nullable: true })
  tagIds?: string[];
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

  @Mutation(() => Products)
  async updateProduct(
    @Arg('id', () => String) id: string,
    @Arg('input') input: UpdateProductInput
  ): Promise<Products> {
    const { categoryIds, ...productData } = input;

    // Récupérer le produit avec toutes les relations nécessaires
    const product = await Products.findOne({
      where: { id },
      relations: ['categories'], // On peut ajouter d'autres relations au besoin
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Mise à jour des champs simples

    // Mise à jour des relations si elles sont fournies
    if (categoryIds) {
      const categories = await Categories.findBy({
        id: In(categoryIds),
      });
      product.categories = categories;
    }

    // if (tagIds) {
    //   const tags = await Tags.findBy({
    //     id: In(tagIds),
    //   });
    //   product.tags = tags;
    // }

    // Plus tard, d'autres relations
    // if (characteristicIds) {
    //   const characteristics = ...
    //   product.characteristics = ...
    // }

    Object.assign(product, productData);
    // Sauvegarder toutes les modifications
    await product.save();

    return product;
  }
}
