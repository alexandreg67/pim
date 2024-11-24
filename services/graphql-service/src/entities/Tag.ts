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
@Entity('tags')
export class Tag extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ unique: true })
  name!: string;

  @Field(() => [Product], { nullable: 'itemsAndList' })
  @ManyToMany(() => Product, (product) => product.tags)
  products!: Product[];
}
