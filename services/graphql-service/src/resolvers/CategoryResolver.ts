import { Resolver, Query, Arg } from 'type-graphql';
import { Category } from '../entities/Category';

@Resolver(Category)
export class CategoryResolver {
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return await Category.find({
      relations: ['products'],
    });
  }

  @Query(() => Category, { nullable: true })
  async category(@Arg('id') id: string): Promise<Category | null> {
    return await Category.findOne({
      where: { id },
      relations: ['products'],
    });
  }
}
