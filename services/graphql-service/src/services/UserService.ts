// src/services/UserService.ts
import { IsNull } from 'typeorm';
import { Users } from '../entities/Users';
import { UpdateUserInput } from '../types/UserInputs';
import { Service } from 'typedi';

@Service()
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

  async getUsers(page: number, limit: number): Promise<Users[]> {
    return await Users.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      where: { deletedAt: IsNull() },
    });
  }

  async getTotalUsers(): Promise<number> {
    return await Users.count({
      where: { deletedAt: IsNull() },
    });
  }

  async getUserById(id: string): Promise<Users | null> {
    return await Users.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<Users> {
    const user = await Users.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });

    // Ne mettre à jour que les champs autorisés
    Object.assign(user, {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      endDate: data.endDate,
      startDate: data.startDate,
    });

    return await user.save();
  }
}
