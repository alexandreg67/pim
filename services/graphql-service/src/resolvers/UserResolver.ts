import { Resolver, Query, Ctx } from 'type-graphql';
import { Users } from '../entities/Users';
import { Context } from '../types/Context';
import { UserService } from '../services/UserService';
import { Service } from 'typedi';

@Service()
@Resolver(Users)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => Users, { nullable: true })
  async me(@Ctx() context: Context): Promise<Users | undefined> {
    return context.user;
  }
}
