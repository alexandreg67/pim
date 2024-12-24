import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Actions } from './Actions';
import { Products } from './Products';
import { Users } from './Users';
import { Field, GraphQLISODateTime, ObjectType } from 'type-graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

interface HistoryDetails {
  previous?: Record<string, unknown>;
  current?: Record<string, unknown>;
  changes?: string[];
}

interface HistoryMetadata {
  browser?: string;
  os?: string;
  device?: string;
  [key: string]: unknown;
}

@ObjectType()
@Index('idx_history_created_at', ['createdAt'], {})
@Index('history_pkey', ['id'], { unique: true })
@Index('idx_history_product_id', ['productId'], {})
@Index('idx_history_user_id', ['userId'], {})
@Entity('history', { schema: 'public' })
export class History extends BaseEntity {
  @Field(() => String)
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field(() => String)
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Field(() => String)
  @Column('uuid', { name: 'product_id' })
  productId: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column('jsonb', { nullable: true })
  details: HistoryDetails;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column('jsonb', { nullable: true })
  metadata: HistoryMetadata;

  @Field(() => String, { nullable: true })
  @Column({ length: 45, nullable: true, name: 'ip_address' })
  ipAddress: string;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true, name: 'user_agent' })
  userAgent: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date | null;

  @Field(() => Actions)
  @ManyToOne(() => Actions, (actions) => actions.histories)
  @JoinColumn([{ name: 'action_id', referencedColumnName: 'id' }])
  action: Actions;

  @Field(() => Products)
  @ManyToOne(() => Products, (products) => products.histories)
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'id' }])
  product: Products;

  @Field(() => Users)
  @ManyToOne(() => Users, (users) => users.histories)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
