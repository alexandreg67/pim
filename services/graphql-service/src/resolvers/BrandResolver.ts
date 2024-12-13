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
    const offset = (page - 1) * limit;

    const query = Brands.createQueryBuilder('brand')
      .leftJoinAndSelect('brand.contacts', 'contacts')
      .orderBy('brand.name', 'ASC')
      .skip(offset)
      .take(limit);

    if (search) {
      query.andWhere(
        'brand.name ILIKE :search OR brand.description ILIKE :search',
        {
          search: `%${search}%`,
        }
      );
    }

    return await query.getMany();
  }

  @Query(() => Brands, { nullable: true })
  async brand(@Arg('id', () => ID) id: string): Promise<Brands | null> {
    return await Brands.findOne({
      where: { id },
      relations: {
        contacts: true,
        products: {
          contact: true,
        },
      },
    });
  }

  @Query(() => Int)
  async totalBrands(
    @Arg('search', () => String, { nullable: true }) search?: string
  ): Promise<number> {
    const qb = Brands.createQueryBuilder('brand').where(
      'brand.deletedAt IS NULL'
    );

    if (search) {
      qb.andWhere(
        '(brand.name ILIKE :search OR brand.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    return qb.getCount();
  }
}
