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
  JoinColumn,
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
  @JoinColumn({ name: 'brandId' }) // Explicitement nommer la colonne
  brand!: Brand;

  @ManyToMany(() => Category)
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
