import { Column, Entity, Index, ManyToMany, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Products } from './Products';

@ObjectType()
@Index('tags_pkey', ['id'], { unique: true })
@Index('tags_name_key', ['name'], { unique: true })
@Entity('tags', { schema: 'public' })
export class Tags extends BaseEntity {
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
  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Field(() => [Products], { nullable: 'itemsAndList' })
  @ManyToMany(() => Products, (products) => products.tags)
  products: Products[];
}
