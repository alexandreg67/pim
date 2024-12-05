import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { Products } from './Products';

@Index('categories_pkey', ['id'], { unique: true })
@Index('categories_name_key', ['name'], { unique: true })
@Entity('categories', { schema: 'public' })
export class Categories {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'name', unique: true, length: 100 })
  name: string;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @ManyToMany(() => Products, (products) => products.categories)
  @JoinTable({
    name: 'products_categories',
    joinColumns: [{ name: 'category_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'product_id', referencedColumnName: 'id' }],
    schema: 'public',
  })
  products: Products[];
}
