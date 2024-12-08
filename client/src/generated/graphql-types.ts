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

export type Actions = {
  __typename?: 'Actions';
  histories?: Maybe<History>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Brands = {
  __typename?: 'Brands';
  contacts?: Maybe<Array<Contacts>>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  exchanges?: Maybe<Array<Exchanges>>;
  id: Scalars['String']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  products?: Maybe<Array<Products>>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type Contacts = {
  __typename?: 'Contacts';
  country?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
};

export type DashboardStats = {
  __typename?: 'DashboardStats';
  pendingCommunications: Scalars['Int']['output'];
  productsByBrand: Array<ProductStat>;
  productsByCategory: Array<ProductStat>;
  recentHistory: Array<HistoryEntry>;
  totalProducts: Scalars['Int']['output'];
};

export type Exchanges = {
  __typename?: 'Exchanges';
  brand?: Maybe<Brands>;
  brandId?: Maybe<Scalars['String']['output']>;
  closedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  status: Scalars['String']['output'];
  user?: Maybe<Users>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type History = {
  __typename?: 'History';
  action: Actions;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['String']['output'];
  product: Products;
  productId: Scalars['String']['output'];
  user: Users;
  userId: Scalars['String']['output'];
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
  brand: Brands;
  brandId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
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

export type QueryProductsArgs = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
};

export type Users = {
  __typename?: 'Users';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  email: Scalars['String']['output'];
  endDate?: Maybe<Scalars['DateTimeISO']['output']>;
  exchanges?: Maybe<Array<Exchanges>>;
  firstName: Scalars['String']['output'];
  histories?: Maybe<Array<History>>;
  id: Scalars['String']['output'];
  isAdmin: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  password: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['DateTimeISO']['output']>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
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

export type GetProductsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetProductsQuery = {
  __typename?: 'Query';
  products: Array<{
    __typename?: 'Products';
    id: string;
    name: string;
    reference: string;
    price: number;
    status: string;
    label?: string | null;
    createdAt?: Date | null;
    brand: { __typename?: 'Brands'; name: string };
  }>;
  dashboardStats: { __typename?: 'DashboardStats'; totalProducts: number };
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
export const GetProductsDocument = gql`
  query GetProducts($page: Int, $limit: Int) {
    products(page: $page, limit: $limit) {
      id
      name
      reference
      price
      status
      label
      createdAt
      brand {
        name
      }
    }
    dashboardStats {
      totalProducts
    }
  }
`;

/**
 * __useGetProductsQuery__
 *
 * To run a query within a React component, call `useGetProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetProductsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetProductsQuery,
    GetProductsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProductsQuery, GetProductsQueryVariables>(
    GetProductsDocument,
    options
  );
}
export function useGetProductsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProductsQuery,
    GetProductsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProductsQuery, GetProductsQueryVariables>(
    GetProductsDocument,
    options
  );
}
export function useGetProductsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetProductsQuery,
        GetProductsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetProductsQuery, GetProductsQueryVariables>(
    GetProductsDocument,
    options
  );
}
export type GetProductsQueryHookResult = ReturnType<typeof useGetProductsQuery>;
export type GetProductsLazyQueryHookResult = ReturnType<
  typeof useGetProductsLazyQuery
>;
export type GetProductsSuspenseQueryHookResult = ReturnType<
  typeof useGetProductsSuspenseQuery
>;
export type GetProductsQueryResult = Apollo.QueryResult<
  GetProductsQuery,
  GetProductsQueryVariables
>;
