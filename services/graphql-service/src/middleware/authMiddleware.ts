import { AuthChecker } from 'type-graphql';
import { Context } from '../types/Context';

export const authChecker: AuthChecker<Context> = ({ context }, roles) => {
  if (!context.user) {
    return false;
  }

  if (roles.length === 0) {
    return true;
  }

  return roles.includes(context.user.role);
};
