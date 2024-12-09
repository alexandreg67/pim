import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Brands } from './Brands';
import { Products } from './Products';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Index('brand_contacts_brand_id_country_key', ['brandId', 'country'], {
  unique: true,
})
@Index('brand_contacts_pkey', ['id'], { unique: true })
@Entity('brand_contacts', { schema: 'public' })
export class BrandContacts extends BaseEntity {
  @Field(() => String)
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field(() => String, { nullable: true })
  @Column('uuid', { name: 'brand_id', nullable: true, unique: true })
  brandId: string | null;

  @Field(() => String)
  @Column('character varying', { name: 'country', unique: true, length: 100 })
  country: string;

  @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'email', nullable: true, length: 100 })
  email: string | null;

  @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'phone', nullable: true, length: 20 })
  phone: string | null;

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

  @ManyToOne(() => Brands, (brands) => brands.brandContacts)
  @JoinColumn([{ name: 'brand_id', referencedColumnName: 'id' }])
  brand: Brands;

  @OneToMany(() => Products, (products) => products.brandContact)
  products: Products[];
}
