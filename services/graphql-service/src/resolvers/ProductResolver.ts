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
  async product(@Arg('id') id: string): Promise<Product | null> {
    return await Product.findOne({
      where: { id },
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
