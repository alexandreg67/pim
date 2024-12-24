import { Resolver, Query, Arg, ID } from 'type-graphql';
import { CharacteristicDefinitions } from '../entities/CharacteristicDefinitions';
import { Service } from 'typedi';

@Service()
@Resolver(CharacteristicDefinitions)
export class CharacteristicDefinitionResolver {
  @Query(() => [CharacteristicDefinitions])
  async characteristicDefinitions(): Promise<CharacteristicDefinitions[]> {
    return await CharacteristicDefinitions.find({
      relations: ['productCharacteristics'],
    });
  }

  @Query(() => CharacteristicDefinitions, { nullable: true })
  async characteristicDefinition(
    @Arg('id', () => ID) id: string
  ): Promise<CharacteristicDefinitions | null> {
    return await CharacteristicDefinitions.findOne({
      where: { id },
      relations: ['productCharacteristics'],
    });
  }
}
