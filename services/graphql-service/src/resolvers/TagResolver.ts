import {
  Resolver,
  Query,
  Arg,
  ID,
  InputType,
  Field,
  Mutation,
} from 'type-graphql';
import { Tags } from '../entities/Tags';
import { Service } from 'typedi';

@InputType()
class CreateTagInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
class UpdateTagInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}

@Service()
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

  @Mutation(() => Tags)
  async createTag(@Arg('input') newTag: CreateTagInput): Promise<Tags> {
    try {
      // Vérifier si un tag avec ce nom existe déjà
      const existingTag = await Tags.findOne({ where: { name: newTag.name } });
      if (existingTag) {
        throw new Error('Un tag avec ce nom existe déjà');
      }

      const tag = new Tags();
      tag.name = newTag.name;
      tag.description = newTag.description ?? null;
      await tag.save();

      return tag;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  @Mutation(() => Tags)
  async updateTag(
    @Arg('id', () => String) id: string,
    @Arg('input') input: UpdateTagInput
  ): Promise<Tags> {
    try {
      const tag = await Tags.findOneBy({ id });
      if (!tag) {
        throw new Error(`Tag with id ${id} not found`);
      }

      Object.assign(tag, input);

      return await tag.save();
    } catch (error) {
      throw new Error(
        `Erreur lors de la mise à jour du tag: ${(error as Error).message}`
      );
    }
  }

  @Mutation(() => Boolean)
  async deleteTag(@Arg('id', () => String) id: string): Promise<boolean> {
    try {
      const tag = await Tags.findOne({
        where: { id },
      });
      if (!tag) {
        throw new Error(`Tag with id: ${id} does not exist.`);
      }

      await Tags.delete(id);
      return true;
    } catch (error) {
      throw console.error(error);
    }
  }
}
