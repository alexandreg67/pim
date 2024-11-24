import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Product } from './Product';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity('brands')
export class Brand extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ unique: true })
  name!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  logo?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contactEmail?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description?: string;

  @Field(() => [Product], { nullable: 'itemsAndList' })
  @OneToMany(() => Product, (product) => product.brand)
  products!: Product[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt!: Date;
}
