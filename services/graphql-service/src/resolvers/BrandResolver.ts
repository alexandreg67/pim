import { Resolver, Query, Arg, ID, Int } from 'type-graphql';
import { Brands } from '../entities/Brands';

@Resolver(Brands)
export class BrandResolver {
  @Query(() => [Brands])
  async brands(
    @Arg('page', () => Int) page: number,
    @Arg('limit', () => Int) limit: number,
    @Arg('search', () => String, { nullable: true }) search?: string
  ): Promise<Brands[]> {
    const qb = Brands.createQueryBuilder('brand')
      .leftJoinAndSelect('brand.contacts', 'contacts')
      .leftJoinAndSelect('brand.products', 'products')
      .select([
        'brand.id',
        'brand.name',
        'brand.description',
        'brand.logo',
        'contacts.id',
        'contacts.email',
        'contacts.phone',
        'contacts.country',
        'products.id',
      ])
      .where('brand.deletedAt IS NULL');

    if (search) {
      qb.andWhere(
        '(brand.name ILIKE :search OR brand.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    return qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  @Query(() => Brands, { nullable: true })
  async brand(@Arg('id', () => ID) id: string): Promise<Brands | null> {
    return await Brands.findOne({
      where: { id },
      relations: ['products'],
    });
  }
}
