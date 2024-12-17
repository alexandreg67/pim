import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Contacts } from '../entities/Contacts';
import { Products } from '../entities/Products';

@Resolver(Contacts)
export class ContactResolver {
  @FieldResolver(() => Number)
  async totalProducts(@Root() contact: Contacts): Promise<number> {
    return await Products.count({
      where: { contact: { id: contact.id } },
    });
  }
}
