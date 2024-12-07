import { ObjectType, Field, Int } from 'type-graphql';

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

  @Field(() => Date)
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
