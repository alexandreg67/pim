import { BaseEntity, Column, Entity, Index, OneToMany } from 'typeorm';
import { BrandContacts } from './BrandContacts';
import { Exchanges } from './Exchanges';
import { Products } from './Products';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Index('brands_pkey', ['id'], { unique: true })
@Index('brands_name_key', ['name'], { unique: true })
@Entity('brands', { schema: 'public' })
export class Brands extends BaseEntity {
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

  @Field(() => String, { nullable: true })
  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'logo', nullable: true, length: 500 })
  logo: string | null;

  @Field(() => Date, { nullable: true })
  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Field(() => Date, { nullable: true })
  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @Field(() => Date, { nullable: true })
  @Column('timestamp with time zone', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @Field(() => [BrandContacts])
  @OneToMany(() => BrandContacts, (brandContacts) => brandContacts.brand)
  contacts: BrandContacts[];

  @OneToMany(() => Exchanges, (exchanges) => exchanges.brand)
  exchanges: Exchanges[];

  @OneToMany(() => Products, (products) => products.brand)
  products: Products[];
}
