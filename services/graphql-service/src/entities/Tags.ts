import { BaseEntity, Column, Entity, Index, ManyToMany } from 'typeorm';
import { Products } from './Products';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Index('tags_pkey', ['id'], { unique: true })
@Index('tags_name_key', ['name'], { unique: true })
@Entity('tags', { schema: 'public' })
export class Tags extends BaseEntity {
  @Field()
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field()
  @Column('character varying', { name: 'name', unique: true, length: 50 })
  name: string;

  @Field({ nullable: true })
  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @ManyToMany(() => Products, (products) => products.tags)
  products: Products[];
}
