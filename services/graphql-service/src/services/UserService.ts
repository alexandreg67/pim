import { Users } from '../entities/Users';

export class UserService {
  async getCurrentUser(userId: string): Promise<Users> {
    // Plus tard, ceci fera une vraie requête à la base de données
    const user = await Users.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
