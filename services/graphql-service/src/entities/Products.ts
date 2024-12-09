import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { History } from './History';
import { ProductCharacteristics } from './ProductCharacteristics';
import { Images } from './Images';
import { BrandContacts } from './BrandContacts';
import { Brands } from './Brands';
import { Categories } from './Categories';
import { Tags } from './Tags';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Index('idx_products_brand', ['brandId'], {})
@Index('products_pkey', ['id'], { unique: true })
@Index('idx_products_name_trgm', ['name'], {})
@Index('products_reference_key', ['reference'], { unique: true })
@Index('idx_products_reference_trgm', ['reference'], {})
@Entity('products', { schema: 'public' })
export class Products extends BaseEntity {
  @Field(() => String)
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field(() => String)
  @Column('character varying', { name: 'reference', unique: true, length: 50 })
  reference: string;

  @Field(() => String)
  @Column('character varying', { name: 'name', length: 150 })
  name: string;

  @Field(() => String, { nullable: true })
  @Column('character varying', {
    name: 'short_description',
    nullable: true,
    length: 300,
  })
  shortDescription: string | null;

  @Field(() => String, { nullable: true })
  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Field(() => String)
  @Column('numeric', { name: 'price', precision: 10, scale: 2 })
  price: string;

  @Field(() => String)
  @Column('character varying', {
    name: 'status',
    length: 20,
    default: () => "'draft'",
  })
  status: string;

  @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'label', nullable: true, length: 50 })
  label: string | null;

  @Field(() => String, { nullable: true })
  @Column('uuid', { name: 'brand_id' })
  brandId: string;

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

  @Field(() => [History])
  @OneToMany(() => History, (history) => history.product)
  histories: History[];

  @Field(() => [ProductCharacteristics])
  @OneToMany(
    () => ProductCharacteristics,
    (productCharacteristics) => productCharacteristics.product
  )
  productCharacteristics: ProductCharacteristics[];

  @Field(() => [Images])
  @ManyToMany(() => Images, (images) => images.products)
  images: Images[];

  @Field(() => BrandContacts)
  @ManyToOne(() => BrandContacts, (brandContacts) => brandContacts.products)
  @JoinColumn([{ name: 'brand_contact_id', referencedColumnName: 'id' }])
  brandContact: BrandContacts;

  @Field(() => Brands)
  @ManyToOne(() => Brands, (brands) => brands.products)
  @JoinColumn([{ name: 'brand_id', referencedColumnName: 'id' }])
  brand: Brands;

  @Field(() => [Categories])
  @ManyToMany(() => Categories, (categories) => categories.products)
  categories: Categories[];

  @Field(() => [Tags])
  @ManyToMany(() => Tags, (tags) => tags.products)
  @JoinTable({
    name: 'products_tags',
    joinColumns: [{ name: 'product_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'tag_id', referencedColumnName: 'id' }],
    schema: 'public',
  })
  tags: Tags[];
}
