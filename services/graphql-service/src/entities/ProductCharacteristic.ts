import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Product } from './Product';
import { CharacteristicDefinition } from './CharacteristicDefinitions';

@ObjectType()
@Entity('productCharacteristics')
export class ProductCharacteristic extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column('text')
  value!: string;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.characteristics)
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Field(() => CharacteristicDefinition)
  @ManyToOne(
    () => CharacteristicDefinition,
    (def) => def.productCharacteristics
  )
  @JoinColumn({ name: 'characteristicId' })
  definition!: CharacteristicDefinition;
}
