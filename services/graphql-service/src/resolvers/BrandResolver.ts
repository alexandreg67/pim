import { Resolver, Query, Arg, Int, FieldResolver, Root } from 'type-graphql';
import { Brands } from '../entities/Brands';
import { Contacts } from '../entities/Contacts';
import { Products } from '../entities/Products';
import { Service } from 'typedi';

@Service()
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
    @Arg('contactOffset', () => Int, { nullable: true }) contactOffset?: number,
    @Arg('countryFilter', () => String, { nullable: true })
    countryFilter?: string
  ): Promise<Contacts[]> {
    const queryBuilder = Contacts.createQueryBuilder('contact').where(
      'contact.brand = :brandId',
      { brandId: brand.id }
    );

    if (countryFilter) {
      queryBuilder.andWhere('LOWER(contact.country) LIKE LOWER(:country)', {
        country: `%${countryFilter}%`,
      });
    }

    queryBuilder
      .take(contactLimit || 5)
      .skip(contactOffset || 0)
      .orderBy('contact.country', 'ASC');

    return await queryBuilder.getMany();
  }

  @FieldResolver(() => Number)
  async totalContacts(
    @Root() brand: Brands,
    @Arg('countryFilter', () => String, { nullable: true })
    countryFilter?: string
  ): Promise<number> {
    const queryBuilder = Contacts.createQueryBuilder('contact').where(
      'contact.brand = :brandId',
      { brandId: brand.id }
    );

    if (countryFilter) {
      queryBuilder.andWhere('LOWER(contact.country) LIKE LOWER(:country)', {
        country: `%${countryFilter}%`,
      });
    }

    return await queryBuilder.getCount();
  }

  @Query(() => [String])
  async brandCountries(
    @Arg('brandId', () => String) brandId: string
  ): Promise<string[]> {
    const countries = await Contacts.createQueryBuilder('contact')
      .select('DISTINCT contact.country')
      .where('contact.brand = :brandId', { brandId })
      .andWhere('contact.country IS NOT NULL')
      .orderBy('contact.country', 'ASC')
      .getRawMany();

    return countries.map((c) => c.country).filter(Boolean);
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

  @Query(() => [Brands])
  async brandsForFilter(): Promise<Brands[]> {
    return await Brands.createQueryBuilder('brand')
      .select(['brand.id', 'brand.name'])
      .orderBy('brand.name', 'ASC')
      .getMany();
  }
}
