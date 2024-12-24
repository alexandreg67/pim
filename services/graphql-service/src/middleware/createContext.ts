import { UserService } from '../services/userService';
import { Context } from '../types/Context';

export async function createContext(): Promise<Context> {
  const userService = new UserService();
  const mockUserId = 'f24f3ece-a15b-4d80-aa1f-fd50a892c2fc';

  return {
    user: await userService.getCurrentUser(mockUserId),
  };
}
