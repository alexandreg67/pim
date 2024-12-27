import { IsNull } from 'typeorm';
import { Users } from '../entities/Users';

export class UserService {
  async getCurrentUser(userId: string): Promise<Users | null> {
    try {
      const user = await Users.findOne({
        where: {
          id: userId,
          deletedAt: IsNull(),
        },
      });

      if (!user?.isActive()) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
}
