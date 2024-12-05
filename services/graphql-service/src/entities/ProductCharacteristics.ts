import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CharacteristicDefinitions } from './CharacteristicDefinitions';
import { Products } from './Products';

@Index('idx_product_characteristics_characteristic', ['characteristicId'], {})
@Index(
  'product_characteristics_product_id_characteristic_id_key',
  ['characteristicId', 'productId'],
  { unique: true }
)
@Index('product_characteristics_pkey', ['id'], { unique: true })
@Index('idx_product_characteristics_product', ['productId'], {})
@Entity('product_characteristics', { schema: 'public' })
export class ProductCharacteristics {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('uuid', { name: 'product_id', nullable: true, unique: true })
  productId: string | null;

  @Column('uuid', { name: 'characteristic_id', nullable: true, unique: true })
  characteristicId: string | null;

  @Column('text', { name: 'value' })
  value: string;

  @ManyToOne(
    () => CharacteristicDefinitions,
    (characteristicDefinitions) =>
      characteristicDefinitions.productCharacteristics
  )
  @JoinColumn([{ name: 'characteristic_id', referencedColumnName: 'id' }])
  characteristic: CharacteristicDefinitions;

  @ManyToOne(() => Products, (products) => products.productCharacteristics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'id' }])
  product: Products;
}
