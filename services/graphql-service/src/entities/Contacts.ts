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
import { Field, GraphQLISODateTime, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Index('contacts_brand_id_country_email_key', ['brandId', 'country', 'email'], {
  unique: true,
})
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

  @Field(() => String)
  @Column('uuid', { name: 'brand_id', unique: true })
  brandId: string;

  @Field(() => String, { nullable: true })
  @Column('character varying', {
    name: 'email',
    nullable: true,
    unique: true,
    length: 100,
  })
  email: string | null;

  @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'phone', nullable: true, length: 20 })
  phone: string | null;

  @Field(() => String, { nullable: true })
  @Column('character varying', {
    name: 'country',
    nullable: true,
    unique: true,
    length: 100,
  })
  country: string | null;

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

  @Field(() => Brands)
  @ManyToOne(() => Brands, (brands) => brands.contacts)
  @JoinColumn([{ name: 'brand_id', referencedColumnName: 'id' }])
  brand: Brands;

  @Field(() => Products)
  @OneToMany(() => Products, (products) => products.contact)
  products: Products[];

  @Field(() => Int)
  async totalProducts(): Promise<number> {
    const count = await Products.count({
      where: { contact: { id: this.id } },
    });
    return count;
  }
}
