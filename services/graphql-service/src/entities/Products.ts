import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
  BaseEntity,
} from 'typeorm';
import { ObjectType, Field, ID, Float } from 'type-graphql';
import { Images } from './Images';
import { ProductCharacteristics } from './ProductCharacteristics';
import { Brands } from './Brands';
import { Categories } from './Categories';
import { Tags } from './Tags';

@ObjectType()
@Index('idx_products_brand', ['brandId'], {})
@Index('products_pkey', ['id'], { unique: true })
@Index('products_reference_key', ['reference'], { unique: true })
@Index('idx_products_reference', ['reference'], {})
@Entity('products', { schema: 'public' })
export class Products extends BaseEntity {
  @Field(() => ID)
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field()
  @Column('character varying', { name: 'reference', unique: true, length: 255 })
  reference: string;

  @Field()
  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @Field({ nullable: true })
  @Column('text', { name: 'shortDescription', nullable: true })
  shortDescription: string | null;

  @Field({ nullable: true })
  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Field(() => Float)
  @Column('numeric', { name: 'price', precision: 10, scale: 2 })
  price: string;

  @Field(() => ID, { nullable: true })
  @Column('uuid', { name: 'brandId', nullable: true })
  brandId: string | null;

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

  @Field(() => [Images], { nullable: 'itemsAndList' })
  @OneToMany(() => Images, (images) => images.product)
  images: Images[];

  @Field(() => [ProductCharacteristics], { nullable: 'itemsAndList' })
  @OneToMany(
    () => ProductCharacteristics,
    (productCharacteristics) => productCharacteristics.product
  )
  productCharacteristics: ProductCharacteristics[];

  @Field(() => Brands, { nullable: true })
  @ManyToOne(() => Brands, (brands) => brands.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'brandId', referencedColumnName: 'id' }])
  brand: Brands;

  @Field(() => [Categories], { nullable: 'itemsAndList' })
  @ManyToMany(() => Categories, (categories) => categories.products)
  categories: Categories[];

  @Field(() => [Tags], { nullable: 'itemsAndList' })
  @ManyToMany(() => Tags, (tags) => tags.products)
  @JoinTable({
    name: 'productsTags',
    joinColumns: [{ name: 'productId', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'tagId', referencedColumnName: 'id' }],
    schema: 'public',
  })
  tags: Tags[];

  // Champ interne TypeORM, pas exposé en GraphQL
  @RelationId((products: Products) => products.brand)
  brandId2: string | null;
}
