import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { ProductCharacteristic } from './ProductCharacteristic';

@ObjectType()
@Entity('characteristicDefinitions')
export class CharacteristicDefinition extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ unique: true })
  name!: string;

  @OneToMany(() => ProductCharacteristic, (pc) => pc.definition)
  productCharacteristics?: ProductCharacteristic[];
}
