import { Resolver, Query, Arg, ID } from 'type-graphql';
import { Tags } from '../entities/Tags';

@Resolver(Tags)
export class TagResolver {
  @Query(() => [Tags])
  async tags(): Promise<Tags[]> {
    return await Tags.find({
      relations: ['products'],
    });
  }

  @Query(() => Tags, { nullable: true })
  async tag(@Arg('id', () => ID) id: string): Promise<Tags | null> {
    return await Tags.findOne({
      where: { id },
      relations: ['products'],
    });
  }

  @Query(() => [Tags])
  async productTags(
    @Arg('productId', () => ID) productId: string
  ): Promise<Tags[]> {
    const tags = await Tags.createQueryBuilder('tag')
      .innerJoin('tag.products', 'product')
      .where('product.id = :productId', { productId })
      .getMany();

    return tags;
  }
}
