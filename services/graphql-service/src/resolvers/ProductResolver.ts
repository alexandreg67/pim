import { Resolver, Query, Arg } from 'type-graphql';
import { Product } from '../entities/Product';

@Resolver(Product)
export class ProductResolver {
  @Query(() => [Product])
  async products(): Promise<Product[]> {
    return await Product.find({
      relations: {
        brand: true,
        categories: true,
        characteristics: {
          definition: true,
        },
        images: true,
        tags: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  @Query(() => Product, { nullable: true })
  async product(
    @Arg('id', { nullable: true }) id?: string,
    @Arg('reference', { nullable: true }) reference?: string
  ): Promise<Product | null> {
    if (!id && !reference) {
      return null;
    }

    const whereCondition = id ? { id } : { reference };

    return await Product.findOne({
      where: whereCondition,
      relations: {
        brand: true,
        categories: true,
        characteristics: {
          definition: true,
        },
        images: true,
        tags: true,
      },
    });
  }
}
