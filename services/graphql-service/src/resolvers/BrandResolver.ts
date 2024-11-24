import { Resolver, Query, Arg } from 'type-graphql';
import { Brand } from '../entities/Brand';

@Resolver(Brand)
export class BrandResolver {
  @Query(() => [Brand])
  async brands(): Promise<Brand[]> {
    return await Brand.find({
      relations: ['products'],
    });
  }

  @Query(() => Brand, { nullable: true })
  async brand(@Arg('id') id: string): Promise<Brand | null> {
    return await Brand.findOne({
      where: { id },
      relations: ['products'],
    });
  }
}
