import { Resolver, Query, Arg, ID } from 'type-graphql';
import { Brands } from '../entities/Brand';

@Resolver(Brands)
export class BrandResolver {
  @Query(() => [Brands])
  async brands(): Promise<Brands[]> {
    return await Brands.find({
      relations: ['products'],
    });
  }

  @Query(() => Brands, { nullable: true })
  async brand(@Arg('id', () => ID) id: string): Promise<Brands | null> {
    return await Brands.findOne({
      where: { id },
      relations: ['products'],
    });
  }
}
