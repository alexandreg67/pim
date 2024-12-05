import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Products } from './Products';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Index('images_pkey', ['id'], { unique: true })
@Index('images_url_key', ['url'], { unique: true })
@Entity('images', { schema: 'public' })
export class Images extends BaseEntity {
  @Field()
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field()
  @Column('character varying', { name: 'url', unique: true, length: 500 })
  url: string;

  @Field({ nullable: true })
  @Column('character varying', {
    name: 'alt_text',
    nullable: true,
    length: 255,
  })
  altText: string | null;

  @Field()
  @Column('boolean', { name: 'is_primary', default: () => 'false' })
  isPrimary: boolean;

  @ManyToMany(() => Products, (products) => products.images)
  @JoinTable({
    name: 'product_images',
    joinColumns: [{ name: 'image_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'product_id', referencedColumnName: 'id' }],
    schema: 'public',
  })
  products: Products[];
}
