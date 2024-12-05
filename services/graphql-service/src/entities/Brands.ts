import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Contacts } from './Contacts';
import { Exchanges } from './Exchanges';
import { Products } from './Products';

@Index('brands_pkey', ['id'], { unique: true })
@Index('brands_name_key', ['name'], { unique: true })
@Entity('brands', { schema: 'public' })
export class Brands {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'name', unique: true, length: 100 })
  name: string;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('character varying', { name: 'logo', nullable: true, length: 500 })
  logo: string | null;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @Column('timestamp with time zone', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Contacts, (contacts) => contacts.brand)
  contacts: Contacts[];

  @OneToMany(() => Exchanges, (exchanges) => exchanges.brand)
  exchanges: Exchanges[];

  @OneToMany(() => Products, (products) => products.brand)
  products: Products[];
}
