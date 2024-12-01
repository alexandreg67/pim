import { BaseEntity, Column, Entity, Index, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { ProductCharacteristics } from './ProductCharacteristics';

@ObjectType()
@Index('characteristicDefinitions_pkey', ['id'], { unique: true })
@Index('characteristicDefinitions_name_key', ['name'], { unique: true })
@Entity('characteristicDefinitions', { schema: 'public' })
export class CharacteristicDefinitions extends BaseEntity {
  @Field(() => ID)
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field()
  @Column('character varying', { name: 'name', unique: true, length: 255 })
  name: string;

  @Field(() => [ProductCharacteristics], { nullable: 'itemsAndList' })
  @OneToMany(
    () => ProductCharacteristics,
    (productCharacteristics) => productCharacteristics.characteristic
  )
  productCharacteristics: ProductCharacteristics[];
}
