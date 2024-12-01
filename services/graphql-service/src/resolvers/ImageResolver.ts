import { Resolver, Query, Arg, ID } from 'type-graphql';
import { Images } from '../entities/Images';

@Resolver(Images)
export class ImageResolver {
  @Query(() => [Images])
  async images(): Promise<Images[]> {
    return await Images.find({
      relations: ['product'],
    });
  }

  @Query(() => [Images])
  async productImages(
    @Arg('productId', () => ID) productId: string
  ): Promise<Images[]> {
    return await Images.find({
      where: { productId },
      relations: ['product'],
    });
  }

  @Query(() => Images, { nullable: true })
  async image(@Arg('id', () => ID) id: string): Promise<Images | null> {
    return await Images.findOne({
      where: { id },
      relations: ['product'],
    });
  }
}
