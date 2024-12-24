import { ObjectType, Field, Int } from 'type-graphql';
import { GraphQLDateTime } from 'graphql-scalars';
import { Actions } from '../entities/Actions';
import { Users } from '../entities/Users';
import { Products } from '../entities/Products';

@ObjectType()
export class ProductStat {
  @Field(() => String, { nullable: true })
  categoryOrBrand!: string;

  @Field(() => Int)
  count!: number;
}

@ObjectType()
export class HistoryEntry {
  @Field(() => Actions)
  action!: Actions;

  @Field(() => Users, { nullable: true })
  user: Users;

  @Field(() => Products, { nullable: true })
  product: Products;

  @Field(() => GraphQLDateTime)
  createdAt!: Date;
}

@ObjectType()
export class DashboardStats {
  @Field(() => Int)
  totalProducts!: number;

  @Field(() => [ProductStat])
  productsByBrand!: ProductStat[];

  @Field(() => [ProductStat])
  productsByCategory!: ProductStat[];

  @Field(() => [HistoryEntry])
  recentHistory!: HistoryEntry[];

  @Field(() => Int)
  pendingCommunications!: number;
}
