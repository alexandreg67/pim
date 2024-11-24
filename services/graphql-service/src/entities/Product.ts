import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Brand } from './Brand';
import { Category } from './Category';
import { Tag } from './Tag';
import { Characteristic } from './Characteristic';
import { Image } from './Image';
import { Field, Float, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity('products')
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  shortDescription?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description?: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Field(() => Brand)
  @ManyToOne(() => Brand, (brand) => brand.products)
  brand!: Brand;

  @Field(() => [Category], { nullable: 'itemsAndList' })
  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable()
  categories!: Category[];

  @Field(() => [Tag], { nullable: 'itemsAndList' })
  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable()
  tags!: Tag[];

  @Field(() => [Characteristic], { nullable: 'itemsAndList' })
  @OneToMany(() => Characteristic, (characteristic) => characteristic.product)
  characteristics?: Characteristic[];

  @Field(() => [Image], { nullable: 'itemsAndList' })
  @OneToMany(() => Image, (image) => image.product)
  images?: Image[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt!: Date;
}
