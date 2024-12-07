import { ObjectType, Field, Int } from 'type-graphql';
import { GraphQLDateTime } from 'graphql-scalars';

@ObjectType()
export class ProductStat {
  @Field(() => String, { nullable: true })
  categoryOrBrand!: string;

  @Field(() => Int)
  count!: number;
}

@ObjectType()
export class HistoryEntry {
  @Field(() => String)
  action!: string;

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
