import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ProductCharacteristics } from './ProductCharacteristics';

@Index('characteristic_definitions_pkey', ['id'], { unique: true })
@Index('characteristic_definitions_name_key', ['name'], { unique: true })
@Entity('characteristic_definitions', { schema: 'public' })
export class CharacteristicDefinitions {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'name', unique: true, length: 100 })
  name: string;

  @OneToMany(
    () => ProductCharacteristics,
    (productCharacteristics) => productCharacteristics.characteristic
  )
  productCharacteristics: ProductCharacteristics[];
}
