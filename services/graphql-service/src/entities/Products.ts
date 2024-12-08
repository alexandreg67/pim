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
import { Contacts } from './Contacts';
import { History } from './History';
import { ProductCharacteristics } from './ProductCharacteristics';
import { Images } from './Images';
import { Brands } from './Brands';
import { Categories } from './Categories';
import { Tags } from './Tags';
import { Field, Float, ObjectType } from 'type-graphql';

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

  @Column('numeric', { name: 'price', precision: 10, scale: 2 })
  private _price: string;

  @Field(() => Float)
  get price(): number {
    return parseFloat(this._price);
  }

  set price(value: number) {
    this._price = value.toFixed(2);
  }

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

  @Field(() => String)
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

  @OneToMany(() => Contacts, (contacts) => contacts.product)
  contacts: Contacts[];

  @OneToMany(() => History, (history) => history.product)
  histories: History[];

  @OneToMany(
    () => ProductCharacteristics,
    (productCharacteristics) => productCharacteristics.product
  )
  productCharacteristics: ProductCharacteristics[];

  @ManyToMany(() => Images, (images) => images.products)
  images: Images[];

  @Field(() => Brands)
  @ManyToOne(() => Brands, (brands) => brands.products)
  @JoinColumn([{ name: 'brand_id', referencedColumnName: 'id' }])
  brand: Brands;

  @ManyToMany(() => Categories, (categories) => categories.products)
  categories: Categories[];

  @ManyToMany(() => Tags, (tags) => tags.products)
  @JoinTable({
    name: 'products_tags',
    joinColumns: [{ name: 'product_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'tag_id', referencedColumnName: 'id' }],
    schema: 'public',
  })
  tags: Tags[];
}
