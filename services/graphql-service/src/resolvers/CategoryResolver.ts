import { Resolver, Query, Mutation, Arg, InputType, Field } from 'type-graphql';
import { Categories } from '../entities/Categories';
import { IsNotEmpty, Length } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsNotEmpty({ message: 'Le nom est requis' })
  @Length(2, 100, { message: 'Le nom doit contenir entre 2 et 100 caractères' })
  name: string;

  @Field({ nullable: true })
  @Length(0, 500, {
    message: 'La description ne peut pas dépasser 500 caractères',
  })
  description?: string;
}

@InputType()
export class UpdateCategoryInput {
  @Field()
  @IsNotEmpty({ message: 'Le nom est requis' })
  @Length(2, 100, { message: 'Le nom doit contenir entre 2 et 100 caractères' })
  name: string;

  @Field({ nullable: true })
  @Length(0, 500, {
    message: 'La description ne peut pas dépasser 500 caractères',
  })
  description?: string;
}

@Resolver(Categories)
export class CategoryResolver {
  @Query(() => [Categories])
  async categories(): Promise<Categories[]> {
    return await Categories.find();
  }

  @Mutation(() => Categories)
  async createCategory(
    @Arg('input') newCategory: CreateCategoryInput
  ): Promise<Categories> {
    try {
      const existingCategory = await Categories.findOne({
        where: { name: newCategory.name },
      });
      if (existingCategory) {
        throw new Error(
          `A category with the name : "${newCategory.name}" already exists.`
        );
      }

      if (existingCategory) {
        throw new Error('Une catégorie avec ce nom existe déjà');
      }

      const category = new Categories();
      category.name = newCategory.name;
      category.description = newCategory.description ?? null;

      await category.save();
      return category;
    } catch (error) {
      throw console.error(error);
    }
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg('id', () => String) id: string): Promise<boolean> {
    try {
      const category = await Categories.findOne({
        where: { id },
      });
      if (!category) {
        throw new Error(`Category with id: ${id} does not exist.`);
      }

      await Categories.delete(id);
      return true;
    } catch (error) {
      throw console.error(error);
    }
  }

  @Mutation(() => Categories)
  async updateCategory(
    @Arg('id', () => String) id: string,
    @Arg('input') input: UpdateCategoryInput
  ): Promise<Categories> {
    try {
      const category = await Categories.findOneBy({ id });
      if (!category) {
        throw new Error(`Category with id ${id} not found`);
      }

      Object.assign(category, input);

      return await Categories.save(category);
    } catch (error) {
      throw new Error(
        `Erreur lors de la mise à jour de la catégorie: ${(error as Error).message}`
      );
    }
  }
}
