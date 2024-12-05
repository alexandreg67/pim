import { BaseEntity, Column, Entity, Index, OneToMany } from 'typeorm';
import { Contacts } from './Contacts';
import { Exchanges } from './Exchanges';
import { Products } from './Products';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Index('brands_pkey', ['id'], { unique: true })
@Index('brands_name_key', ['name'], { unique: true })
@Entity('brands', { schema: 'public' })
export class Brands extends BaseEntity {
  @Field()
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field()
  @Column('character varying', { name: 'name', unique: true, length: 100 })
  name: string;

  @Field({ nullable: true })
  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Field({ nullable: true })
  @Column('character varying', { name: 'logo', nullable: true, length: 500 })
  logo: string | null;

  @Field({ nullable: true })
  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Field({ nullable: true })
  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @Field({ nullable: true })
  @Column('timestamp with time zone', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Contacts, (contacts) => contacts.brand)
  contacts: Contacts[];

  @OneToMany(() => Exchanges, (exchanges) => exchanges.brand)
  exchanges: Exchanges[];

  @OneToMany(() => Products, (products) => products.brand)
  products: Products[];
}
