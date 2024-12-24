import { Resolver, Query } from 'type-graphql';
import { DashboardStats } from '../types/DashboardStats';
import { Products } from '../entities/Products';
import { History } from '../entities/History';
import { Exchanges } from '../entities/Exchanges';
import { Service } from 'typedi';

@Service()
@Resolver()
export class DashboardResolver {
  @Query(() => DashboardStats)
  async dashboardStats() {
    const totalProducts = await Products.count();
    const productsByBrand = await Products.createQueryBuilder('product')
      .leftJoin('product.brand', 'brand')
      .select('brand.name', 'brand')
      .addSelect('COUNT(product.id)', 'count')
      .groupBy('brand.name')
      .getRawMany();

    const productsByCategory = await Products.createQueryBuilder('product')
      .leftJoin('product.categories', 'category')
      .select('category.name', 'category')
      .addSelect('COUNT(product.id)', 'count')
      .groupBy('category.name')
      .getRawMany();

    const recentHistory = await History.find({
      relations: ['action', 'user', 'product'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const pendingCommunications = await Exchanges.count({
      where: { status: 'pending' },
    });

    return {
      totalProducts,
      productsByBrand: productsByBrand.map((brand) => ({
        categoryOrBrand: brand.brand || 'Non défini',
        count: parseInt(brand.count, 10),
      })),
      productsByCategory: productsByCategory.map((category) => ({
        categoryOrBrand: category.category || 'Pas de catégorie',
        count: parseInt(category.count, 10),
      })),
      recentHistory,
      pendingCommunications,
    };
  }
}
