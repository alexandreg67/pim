import { Resolver, Query, Arg, ID, Authorized } from 'type-graphql';
import { CharacteristicDefinitions } from '../entities/CharacteristicDefinitions';
import { Service } from 'typedi';

@Service()
@Resolver(CharacteristicDefinitions)
export class CharacteristicDefinitionResolver {
  @Query(() => [CharacteristicDefinitions])
  @Authorized(['admin', 'collaborator'])
  async characteristicDefinitions(): Promise<CharacteristicDefinitions[]> {
    return await CharacteristicDefinitions.find();
  }

  @Query(() => CharacteristicDefinitions, { nullable: true })
  @Authorized(['admin', 'collaborator'])
  async characteristicDefinition(
    @Arg('id', () => ID) id: string
  ): Promise<CharacteristicDefinitions | null> {
    return await CharacteristicDefinitions.findOne({
      where: { id },
      relations: ['productCharacteristics'],
    });
  }
}
