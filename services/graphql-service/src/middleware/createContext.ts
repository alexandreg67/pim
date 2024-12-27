import { HistoryService } from '../services/HistoryService';
import { UserService } from '../services/UserService';
import { Context } from '../types/Context';

export async function createContext(): Promise<Context> {
  const userService = new UserService();
  // Pour le développement, on peut garder le mockUserId
  const mockUserId = 'eee4515e-8e9e-40b5-a935-c32d6ca9d160';

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
