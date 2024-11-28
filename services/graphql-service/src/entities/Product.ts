import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  BaseEntity,
} from 'typeorm';
import { Brand } from './Brand';
import { Category } from './Category';
import { Tag } from './Tag';
import { Image } from './Image';
import { ProductCharacteristic } from './ProductCharacteristic';
import { Field, Float, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity('products')
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ unique: true })
  reference!: string;

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
  @JoinTable({
    name: 'productsCategories',
    joinColumn: {
      name: 'productId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'categoryId',
      referencedColumnName: 'id',
    },
  })
  categories!: Category[];

  @Field(() => [Tag], { nullable: 'itemsAndList' })
  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable({
    name: 'productsTags',
    joinColumn: {
      name: 'productId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    },
  })
  tags!: Tag[];

  @Field(() => [ProductCharacteristic], { nullable: 'itemsAndList' })
  @OneToMany(() => ProductCharacteristic, (pc) => pc.product)
  characteristics?: ProductCharacteristic[];

  @Field(() => [Image], { nullable: 'itemsAndList' })
  @OneToMany(() => Image, (image) => image.product)
  images?: Image[];

  @Field(() => Date)
  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Field(() => Date)
  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @Field(() => Date, { nullable: true })
  @Column('timestamp with time zone', { nullable: true })
  deletedAt?: Date;
}
