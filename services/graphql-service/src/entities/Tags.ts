import { Column, Entity, Index, ManyToMany } from 'typeorm';
import { Products } from './Products';

@Index('tags_pkey', ['id'], { unique: true })
@Index('tags_name_key', ['name'], { unique: true })
@Entity('tags', { schema: 'public' })
export class Tags {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'name', unique: true, length: 50 })
  name: string;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @ManyToMany(() => Products, (products) => products.tags)
  products: Products[];
}
