import { History } from '../entities/History';
import { Actions } from '../entities/Actions';
import { Users } from '../entities/Users';
import { Service } from 'typedi';

@Service()
export class HistoryService {
  async createHistory(params: {
    user: Users;
    action: Actions;
    productId: string;
  }): Promise<History> {
    try {
      const action = await Actions.findOneByOrFail({
        name: params.action.name,
        active: true, // Vérifier que l'action est active
      });

      const history = new History();
      history.user = params.user;
      history.action = action;
      history.productId = params.productId;

      return await history.save();
    } catch (error) {
      throw new Error(`Failed to create history: ${error}`);
    }
  }
}
