import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { Product } from './Product';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity('characteristics')
export class Characteristic extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column('text')
  value!: string;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.characteristics)
  product!: Product;
}
