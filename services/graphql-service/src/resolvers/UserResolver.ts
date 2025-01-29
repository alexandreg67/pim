import { Arg, Authorized, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Users } from '../entities/Users';
import { Service } from 'typedi';
import { UserService } from '../services/UserService';
import { UpdateUserInput } from '../types/UserInputs';

@Service()
@Resolver(Users)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [Users])
  @Authorized(['admin'])
  async users(
    @Arg('page', () => Int) page: number,
    @Arg('limit', () => Int) limit: number
  ): Promise<Users[]> {
    return this.userService.getUsers(page, limit);
  }

  @Query(() => Int)
  @Authorized(['admin'])
  async totalUsers(): Promise<number> {
    return this.userService.getTotalUsers();
  }

  @Query(() => Users, { nullable: true })
  @Authorized(['admin'])
  async user(@Arg('id') id: string): Promise<Users | null> {
    return this.userService.getUserById(id);
  }

  @Mutation(() => Users)
  @Authorized(['admin'])
  async updateUser(
    @Arg('id') id: string,
    @Arg('input') input: UpdateUserInput
  ): Promise<Users> {
    return this.userService.updateUser(id, input);
  }

  @Mutation(() => Boolean)
  @Authorized(['admin'])
  async resetUserPassword(@Arg('userId') userId: string): Promise<boolean> {
    try {
      const authServiceUrl = process.env.AUTH_SERVICE_URL;
      if (!authServiceUrl) {
        throw new Error('AUTH_SERVICE_URL is not configured');
      }

      const response = await fetch(`${authServiceUrl}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        console.error('Auth service error:', await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  }
}
