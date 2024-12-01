import { BaseEntity, Column, Entity, Index, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Products } from './Products';

@ObjectType()
@Index('brands_pkey', ['id'], { unique: true })
@Index('brands_name_key', ['name'], { unique: true })
@Entity('brands', { schema: 'public' })
export class Brands extends BaseEntity {
  @Field(() => ID)
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field()
  @Column('character varying', { name: 'name', unique: true, length: 255 })
  name: string;

  @Field({ nullable: true })
  @Column('character varying', { name: 'country', nullable: true, length: 255 })
  country: string | null;

  @Field({ nullable: true })
  @Column('character varying', { name: 'logo', nullable: true, length: 255 })
  logo: string | null;

  @Field({ nullable: true })
  @Column('character varying', {
    name: 'contactEmail',
    nullable: true,
    length: 255,
  })
  contactEmail: string | null;

  @Field({ nullable: true })
  @Column('character varying', { name: 'phone', nullable: true, length: 20 })
  phone: string | null;

  @Field({ nullable: true })
  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Field(() => Date, { nullable: true })
  @Column('timestamp without time zone', {
    name: 'createdAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Field(() => Date, { nullable: true })
  @Column('timestamp without time zone', {
    name: 'updatedAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @Field(() => Date, { nullable: true })
  @Column('timestamp without time zone', { name: 'deletedAt', nullable: true })
  deletedAt: Date | null;

  @Field(() => [Products], { nullable: 'itemsAndList' }) // Relation avec les produits
  @OneToMany(() => Products, (products) => products.brand)
  products: Products[];
}
