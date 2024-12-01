import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
  BaseEntity,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { CharacteristicDefinitions } from './CharacteristicDefinitions';
import { Products } from './Products';

@ObjectType()
@Index('idx_product_characteristics_characteristic', ['characteristicId'], {})
@Index(
  'productCharacteristics_productId_characteristicId_key',
  ['characteristicId', 'productId'],
  { unique: true }
)
@Index('productCharacteristics_pkey', ['id'], { unique: true })
@Index('idx_product_characteristics_product', ['productId'], {})
@Entity('productCharacteristics', { schema: 'public' })
export class ProductCharacteristics extends BaseEntity {
  @Field(() => ID)
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field(() => ID)
  @Column('uuid', { name: 'productId', unique: true })
  productId: string;

  @Field(() => ID)
  @Column('uuid', { name: 'characteristicId', unique: true })
  characteristicId: string;

  @Field()
  @Column('text', { name: 'value' })
  value: string;

  @Field(() => CharacteristicDefinitions)
  @ManyToOne(
    () => CharacteristicDefinitions,
    (characteristicDefinitions) =>
      characteristicDefinitions.productCharacteristics,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn([{ name: 'characteristicId', referencedColumnName: 'id' }])
  characteristic: CharacteristicDefinitions;

  @Field(() => Products)
  @ManyToOne(() => Products, (products) => products.productCharacteristics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Products;

  // Champs internes TypeORM, pas exposés en GraphQL
  @RelationId(
    (productCharacteristics: ProductCharacteristics) =>
      productCharacteristics.characteristic
  )
  characteristicId2: string;

  @RelationId(
    (productCharacteristics: ProductCharacteristics) =>
      productCharacteristics.product
  )
  productId2: string;
}
