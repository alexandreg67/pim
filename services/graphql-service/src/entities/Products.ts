import {
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

@Index('idx_products_brand', ['brandId'], {})
@Index('products_pkey', ['id'], { unique: true })
@Index('idx_products_name_trgm', ['name'], {})
@Index('products_reference_key', ['reference'], { unique: true })
@Index('idx_products_reference_trgm', ['reference'], {})
@Entity('products', { schema: 'public' })
export class Products {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'reference', unique: true, length: 50 })
  reference: string;

  @Column('character varying', { name: 'name', length: 150 })
  name: string;

  @Column('character varying', {
    name: 'short_description',
    nullable: true,
    length: 300,
  })
  shortDescription: string | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('numeric', { name: 'price', precision: 10, scale: 2 })
  price: string;

  @Column('character varying', {
    name: 'status',
    length: 20,
    default: () => "'draft'",
  })
  status: string;

  @Column('character varying', { name: 'label', nullable: true, length: 50 })
  label: string | null;

  @Column('uuid', { name: 'brand_id' })
  brandId: string;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

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
