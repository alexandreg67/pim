import axios from 'axios';
import { HistoryService } from '../services/HistoryService';
import { UserService } from '../services/UserService';
import { Context } from '../types/Context';

interface RequestContext {
  req: {
    headers: {
      cookie?: string;
    };
  };
}

export async function createContext({ req }: RequestContext): Promise<Context> {
  const userService = new UserService();
  const token = req.headers.cookie?.match(/token=([^;]+)/)?.[1];

  if (process.env.NODE_ENV === 'development' && !token) {
    // Fallback pour le dev
    const mockUserId = '3a73bafd-7913-488e-8b6c-bb91f844b93d';
    const user = await userService.getCurrentUser(mockUserId);
    return {
      user,
      historyService: new HistoryService(),
    };
  }

  try {
    const response = await axios.get('http://auth:4001/auth/verify', {
      headers: { Cookie: `token=${token}` },
    });

    if (response.data.userId) {
      const user = await userService.getCurrentUser(response.data.userId);
      return {
        user,
        historyService: new HistoryService(),
      };
    }
  } catch (error) {
    console.error('Auth verification failed:', error);
  }

  return {
    user: null,
    historyService: new HistoryService(),
  };
}
