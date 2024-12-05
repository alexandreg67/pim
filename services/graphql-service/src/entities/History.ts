import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Actions } from './Actions';
import { Products } from './Products';
import { Users } from './Users';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Index('idx_history_created_at', ['createdAt'], {})
@Index('history_pkey', ['id'], { unique: true })
@Index('idx_history_product_id', ['productId'], {})
@Index('idx_history_user_id', ['userId'], {})
@Entity('history', { schema: 'public' })
export class History extends BaseEntity {
  @Field()
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field()
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Field()
  @Column('uuid', { name: 'product_id' })
  productId: string;

  @Field()
  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @ManyToOne(() => Actions, (actions) => actions.histories)
  @JoinColumn([{ name: 'action_id', referencedColumnName: 'id' }])
  action: Actions;

  @ManyToOne(() => Products, (products) => products.histories)
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'id' }])
  product: Products;

  @ManyToOne(() => Users, (users) => users.histories)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
