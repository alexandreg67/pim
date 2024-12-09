import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ProductCharacteristics } from './ProductCharacteristics';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Index('characteristic_definitions_pkey', ['id'], { unique: true })
@Index('characteristic_definitions_name_key', ['name'], { unique: true })
@Entity('characteristic_definitions', { schema: 'public' })
export class CharacteristicDefinitions {
  @Field(() => String)
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field(() => String)
  @Column('character varying', { name: 'name', unique: true, length: 100 })
  name: string;

  @Field(() => ProductCharacteristics, { nullable: true })
  @OneToMany(
    () => ProductCharacteristics,
    (productCharacteristics) => productCharacteristics.characteristic
  )
  productCharacteristics: ProductCharacteristics[];
}
