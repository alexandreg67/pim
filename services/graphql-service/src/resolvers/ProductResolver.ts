import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Product } from '../entities/Product';

@Resolver(Product)
export class ProductResolver {
  @Query(() => [Product])
  async products(): Promise<Product[]> {
    return Product.find();
  }

  @Query(() => Product, { nullable: true })
  async product(@Arg('id') id: string): Promise<Product | null> {
    return Product.findOneBy({ id });
  }

  @Mutation(() => Product)
  async createProduct(
    @Arg('name') name: string,
    @Arg('description', { nullable: true }) description?: string
  ): Promise<Product> {
    // Création et sauvegarde en une seule étape avec BaseEntity
    return Product.create({ name, description }).save();
  }
}
