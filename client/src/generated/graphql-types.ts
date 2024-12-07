import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: Date; output: Date };
  DateTimeISO: { input: Date; output: Date };
};

export type DashboardStats = {
  __typename?: 'DashboardStats';
  pendingCommunications: Scalars['Int']['output'];
  productsByBrand: Array<ProductStat>;
  productsByCategory: Array<ProductStat>;
  recentHistory: Array<HistoryEntry>;
  totalProducts: Scalars['Int']['output'];
};

export type HistoryEntry = {
  __typename?: 'HistoryEntry';
  action: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
};

export type ProductStat = {
  __typename?: 'ProductStat';
  categoryOrBrand?: Maybe<Scalars['String']['output']>;
  count: Scalars['Int']['output'];
};

export type Products = {
  __typename?: 'Products';
  brandId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['String']['output'];
  reference: Scalars['String']['output'];
  shortDescription?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type Query = {
  __typename?: 'Query';
  dashboardStats: DashboardStats;
  products: Array<Products>;
};

export type DashboardStatsQueryVariables = Exact<{ [key: string]: never }>;

export type DashboardStatsQuery = {
  __typename?: 'Query';
  dashboardStats: {
    __typename?: 'DashboardStats';
    totalProducts: number;
    pendingCommunications: number;
    productsByBrand: Array<{
      __typename?: 'ProductStat';
      categoryOrBrand?: string | null;
      count: number;
    }>;
    productsByCategory: Array<{
      __typename?: 'ProductStat';
      categoryOrBrand?: string | null;
      count: number;
    }>;
    recentHistory: Array<{
      __typename?: 'HistoryEntry';
      action: string;
      createdAt: Date;
    }>;
  };
};

export const DashboardStatsDocument = gql`
  query DashboardStats {
    dashboardStats {
      totalProducts
      productsByBrand {
        categoryOrBrand
        count
      }
      productsByCategory {
        categoryOrBrand
        count
      }
      recentHistory {
        action
        createdAt
      }
      pendingCommunications
    }
  }
`;

/**
 * __useDashboardStatsQuery__
 *
 * To run a query within a React component, call `useDashboardStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDashboardStatsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    DashboardStatsQuery,
    DashboardStatsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DashboardStatsQuery, DashboardStatsQueryVariables>(
    DashboardStatsDocument,
    options
  );
}
export function useDashboardStatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DashboardStatsQuery,
    DashboardStatsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DashboardStatsQuery, DashboardStatsQueryVariables>(
    DashboardStatsDocument,
    options
  );
}
export function useDashboardStatsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        DashboardStatsQuery,
        DashboardStatsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    DashboardStatsQuery,
    DashboardStatsQueryVariables
  >(DashboardStatsDocument, options);
}
export type DashboardStatsQueryHookResult = ReturnType<
  typeof useDashboardStatsQuery
>;
export type DashboardStatsLazyQueryHookResult = ReturnType<
  typeof useDashboardStatsLazyQuery
>;
export type DashboardStatsSuspenseQueryHookResult = ReturnType<
  typeof useDashboardStatsSuspenseQuery
>;
export type DashboardStatsQueryResult = Apollo.QueryResult<
  DashboardStatsQuery,
  DashboardStatsQueryVariables
>;
