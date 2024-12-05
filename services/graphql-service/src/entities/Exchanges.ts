import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Brands } from './Brands';
import { Users } from './Users';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Index('idx_exchanges_brand_id', ['brandId'], {})
@Index('exchanges_pkey', ['id'], { unique: true })
@Index('idx_exchanges_status', ['status'], {})
@Index('idx_exchanges_user_id', ['userId'], {})
@Entity('exchanges', { schema: 'public' })
export class Exchanges extends BaseEntity {
  @Field()
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field({ nullable: true })
  @Column('uuid', { name: 'user_id', nullable: true })
  userId: string | null;

  @Field({ nullable: true })
  @Column('uuid', { name: 'brand_id', nullable: true })
  brandId: string | null;

  @Field()
  @Column('text', { name: 'message' })
  message: string;

  @Field()
  @Column('character varying', { name: 'status', length: 20 })
  status: string;

  @Field({ nullable: true })
  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Field({ nullable: true })
  @Column('timestamp with time zone', { name: 'closed_at', nullable: true })
  closedAt: Date | null;

  @ManyToOne(() => Brands, (brands) => brands.exchanges)
  @JoinColumn([{ name: 'brand_id', referencedColumnName: 'id' }])
  brand: Brands;

  @ManyToOne(() => Users, (users) => users.exchanges)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
