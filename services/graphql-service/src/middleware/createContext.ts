import { HistoryService } from '../services/HistoryService';
import { UserService } from '../services/UserService';
import { Context } from '../types/Context';

export async function createContext(): Promise<Context> {
  const userService = new UserService();
  // Pour le développement, on peut garder le mockUserId
  const mockUserId = '3a73bafd-7913-488e-8b6c-bb91f844b93d';

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
