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
@Entity('images')
export class Image extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  url!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  altText?: string;

  @Field()
  @Column({ default: false })
  isPrimary!: boolean;

  @ManyToOne(() => Product, (product) => product.images)
  product!: Product;
}
