import { Resolver, Query, Arg, Int, FieldResolver, Root } from 'type-graphql';
import { Brands } from '../entities/Brands';
import { Contacts } from '../entities/Contacts';
import { Products } from '../entities/Products';

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
  async brand(@Arg('id', () => String) id: string): Promise<Brands | null> {
    return await Brands.findOne({ where: { id } });
  }

  @FieldResolver(() => [Contacts])
  async contacts(
    @Root() brand: Brands,
    @Arg('contactLimit', () => Int, { nullable: true }) contactLimit?: number,
    @Arg('contactOffset', () => Int, { nullable: true }) contactOffset?: number
  ): Promise<Contacts[]> {
    return await Contacts.find({
      where: { brand: { id: brand.id } },
      take: contactLimit || 5,
      skip: contactOffset || 0,
    });
  }

  @FieldResolver(() => Number)
  async totalContacts(@Root() brand: Brands): Promise<number> {
    return await Contacts.count({ where: { brand: { id: brand.id } } });
  }

  @FieldResolver(() => Number)
  async totalProducts(@Root() brand: Brands): Promise<number> {
    return await Products.count({ where: { brand: { id: brand.id } } });
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
