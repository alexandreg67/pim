import { Resolver, Query, Arg, ID } from 'type-graphql';
import { Products } from '../entities/Products';

@Resolver(Products)
export class ProductResolver {
  @Query(() => [Products])
  async products(
    @Arg('search', { nullable: true }) search?: string,
    @Arg('brandId', () => ID, { nullable: true }) brandId?: string,
    @Arg('categoryId', () => ID, { nullable: true }) categoryId?: string
  ): Promise<Products[]> {
    const queryBuilder = Products.createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.tags', 'tags')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.productCharacteristics', 'characteristics')
      .leftJoinAndSelect('characteristics.characteristic', 'characteristicDef');

    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.reference ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (brandId) {
      queryBuilder.andWhere('brand.id = :brandId', { brandId });
    }

    if (categoryId) {
      queryBuilder.andWhere('categories.id = :categoryId', { categoryId });
    }

    return await queryBuilder.getMany();
  }

  @Query(() => Products, { nullable: true })
  async product(
    @Arg('id', () => ID, { nullable: true }) id?: string,
    @Arg('reference', { nullable: true }) reference?: string
  ): Promise<Products | null> {
    if (!id && !reference) return null;

    return await Products.findOne({
      where: id ? { id } : { reference },
      relations: [
        'brand',
        'categories',
        'tags',
        'images',
        'productCharacteristics',
        'productCharacteristics.characteristic',
      ],
    });
  }
}
