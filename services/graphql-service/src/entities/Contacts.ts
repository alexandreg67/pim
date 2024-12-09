import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Brands } from './Brands';
import { Products } from './Products';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Index('contacts_pkey', ['id'], { unique: true })
@Entity('contacts', { schema: 'public' })
export class Contacts extends BaseEntity {
  @Field(() => String)
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'email', nullable: true, length: 100 })
  email: string | null;

  @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'phone', nullable: true, length: 20 })
  phone: string | null;

  @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'country', nullable: true, length: 100 })
  country: string | null;

  @Field(() => Brands, { nullable: true })
  @ManyToOne(() => Brands, (brands) => brands.contacts)
  @JoinColumn([{ name: 'brand_id', referencedColumnName: 'id' }])
  brand: Brands;

  @Field(() => Products, { nullable: true })
  @ManyToOne(() => Products, (products) => products.contacts)
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'id' }])
  product: Products;
}
