import { Resolver, Query, Authorized } from 'type-graphql';
import { History } from '../entities/History';

@Resolver(History)
export class HistoryResolver {
  @Query(() => [History])
  @Authorized(['admin', 'collaborator'])
  async getHistory(): Promise<History[]> {
    return await History.find({
      relations: {
        action: true,
        user: true,
        product: true,
      },
      withDeleted: true,
      order: {
        createdAt: 'DESC',
      },
      take: 10,
    });
  }
}
