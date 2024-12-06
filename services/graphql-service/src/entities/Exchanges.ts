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
  @Field(() => String)
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field(() => String, { nullable: true })
  @Column('uuid', { name: 'user_id', nullable: true })
  userId: string | null;

  @Field(() => String, { nullable: true })
  @Column('uuid', { name: 'brand_id', nullable: true })
  brandId: string | null;

  @Field(() => String)
  @Column('text', { name: 'message' })
  message: string;

  @Field(() => String)
  @Column('character varying', { name: 'status', length: 20 })
  status: string;

  @Field(() => Date, { nullable: true })
  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Field(() => Date, { nullable: true })
  @Column('timestamp with time zone', { name: 'closed_at', nullable: true })
  closedAt: Date | null;

  @Field(() => Brands, { nullable: true })
  @ManyToOne(() => Brands, (brands) => brands.exchanges)
  @JoinColumn([{ name: 'brand_id', referencedColumnName: 'id' }])
  brand: Brands;

  @Field(() => Users, { nullable: true })
  @ManyToOne(() => Users, (users) => users.exchanges)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
