import { HistoryService } from '../services/HistoryService';
import { UserService } from '../services/UserService';
import { Context } from '../types/Context';

export async function createContext(): Promise<Context> {
  const userService = new UserService();
  // Pour le développement, on peut garder le mockUserId
  const mockUserId = 'd4823c2d-206a-4f53-b5eb-11feff72c49e';

  const user = await userService.getCurrentUser(mockUserId);

  // Log pour le développement
  if (process.env.NODE_ENV === 'development') {
    console.info(
      `Context created with user: ${user?.firstName} (${user?.role})`
    );
  }

  return {
    user,
    historyService: new HistoryService(),
  };
}
