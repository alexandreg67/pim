import { Resolver, Query, Arg, FieldResolver, Root } from 'type-graphql';
import { Product } from '../entities/Product';
import { Image } from '../entities/Image';

@Resolver(Product)
export class ProductResolver {
  @Query(() => [Product])
  async products(): Promise<Product[]> {
    return await Product.find({
      relations: ['brand', 'categories', 'characteristics', 'images'],
    });
  }

  @Query(() => Product, { nullable: true })
  async product(@Arg('id') id: string): Promise<Product | null> {
    return await Product.findOne({
      where: { id },
      relations: ['brand', 'categories', 'characteristics', 'images'],
    });
  }

  @FieldResolver(() => [Image])
  async images(@Root() product: Product): Promise<Image[]> {
    return Image.find({
      where: { product: { id: product.id } },
      order: { isPrimary: 'DESC' },
    });
  }
}
