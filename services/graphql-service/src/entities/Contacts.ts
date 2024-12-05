import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { Brands } from './Brands';
import { Products } from './Products';

@Index('contacts_pkey', ['id'], { unique: true })
@Entity('contacts', { schema: 'public' })
export class Contacts {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'email', nullable: true, length: 100 })
  email: string | null;

  @Column('character varying', { name: 'phone', nullable: true, length: 20 })
  phone: string | null;

  @Column('character varying', { name: 'country', nullable: true, length: 100 })
  country: string | null;

  @ManyToOne(() => Brands, (brands) => brands.contacts)
  @JoinColumn([{ name: 'brand_id', referencedColumnName: 'id' }])
  brand: Brands;

  @ManyToOne(() => Products, (products) => products.contacts)
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'id' }])
  product: Products;

  @RelationId((contacts: Contacts) => contacts.brand)
  brandId: string | null;

  @RelationId((contacts: Contacts) => contacts.product)
  productId: string | null;
}
