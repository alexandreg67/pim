import { Service } from 'typedi';
import { History } from '../entities/History';
import { Users } from '../entities/Users';
import { Actions } from '../entities/Actions';

interface HistoryCreateInput {
  user: Users | null;
  action: Actions;
  productId: string;
  metadata?: Record<string, unknown>;
}

@Service()
export class HistoryService {
  async createHistory({
    user,
    action,
    productId,
    metadata,
  }: HistoryCreateInput): Promise<History> {
    if (!user) {
      throw new Error('User is required to create history');
    }

    const history = new History();

    history.userId = user.id;
    history.productId = productId;
    history.action = action;
    history.metadata = metadata || {};

    return await history.save();
  }
}
