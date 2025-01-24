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
