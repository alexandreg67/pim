import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
  BaseEntity,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Products } from './Products';

@ObjectType()
@Index('images_pkey', ['id'], { unique: true })
@Index('idx_images_product', ['productId'], {})
@Entity('images', { schema: 'public' })
export class Images extends BaseEntity {
  @Field(() => ID)
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field()
  @Column('character varying', { name: 'url', length: 255 })
  url: string;

  @Field({ nullable: true })
  @Column('character varying', { name: 'altText', nullable: true, length: 255 })
  altText: string | null;

  @Field({ nullable: true })
  @Column('boolean', {
    name: 'isPrimary',
    nullable: true,
    default: () => 'false',
  })
  isPrimary: boolean | null;

  @Field(() => ID, { nullable: true })
  @Column('uuid', { name: 'productId', nullable: true })
  productId: string | null;

  @Field(() => Products)
  @ManyToOne(() => Products, (products) => products.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Products;

  // On ajoute pas de décorateur @Field pour productId2 car c'est un champ interne
  @RelationId((images: Images) => images.product)
  productId2: string | null;
}
