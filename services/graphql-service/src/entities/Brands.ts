import { BaseEntity, Column, Entity, Index, OneToMany } from 'typeorm';
import { Contacts } from './Contacts';
import { Exchanges } from './Exchanges';
import { Products } from './Products';
import { Field, GraphQLISODateTime, ObjectType } from 'type-graphql';

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
  @Column('character varying', { name: 'logo', nullable: true, length: 500 })
  logo: string | null;

  @Field(() => String, { nullable: true })
  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column('timestamp with time zone', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @Field(() => [Contacts])
  @OneToMany(() => Contacts, (contacts) => contacts.brand)
  contacts: Contacts[];

  @Field(() => [Exchanges])
  @OneToMany(() => Exchanges, (exchanges) => exchanges.brand)
  exchanges: Exchanges[];

  @Field(() => [Products], { nullable: true })
  @OneToMany(() => Products, (products) => products.brand, { nullable: true })
  products: Products[];

  @Field(() => Number)
  totalContacts: number;

  @Field(() => Number)
  totalProducts: number;
}
