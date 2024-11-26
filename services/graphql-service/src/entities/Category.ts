import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  BaseEntity,
} from 'typeorm';
import { Product } from './Product';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity('categories')
export class Category extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ unique: true })
  name!: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description?: string;

  @Field(() => [Product], { nullable: 'itemsAndList' })
  @ManyToMany(() => Product, (product) => product.categories)
  products!: Product[];
}
