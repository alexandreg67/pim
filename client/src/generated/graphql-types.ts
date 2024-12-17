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
  histories: History;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Brands = {
  __typename?: 'Brands';
  contacts: Array<Contacts>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  exchanges: Array<Exchanges>;
  id: Scalars['String']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  products?: Maybe<Array<Products>>;
  totalContacts: Scalars['Float']['output'];
  totalProducts: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type BrandsContactsArgs = {
  contactLimit?: InputMaybe<Scalars['Int']['input']>;
  contactOffset?: InputMaybe<Scalars['Int']['input']>;
};

export type Categories = {
  __typename?: 'Categories';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  products: Products;
};

export type CharacteristicDefinitions = {
  __typename?: 'CharacteristicDefinitions';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  productCharacteristics: ProductCharacteristics;
};

export type Contacts = {
  __typename?: 'Contacts';
  brand: Brands;
  brandId: Scalars['String']['output'];
  country?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  products: Products;
  totalProducts: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
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
  brand: Brands;
  brandId?: Maybe<Scalars['String']['output']>;
  closedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  status: Scalars['String']['output'];
  user: Users;
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

export type Images = {
  __typename?: 'Images';
  altText?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isPrimary: Scalars['Boolean']['output'];
  products: Products;
  url: Scalars['String']['output'];
};

export type PaginatedProductsResponse = {
  __typename?: 'PaginatedProductsResponse';
  hasMore: Scalars['Boolean']['output'];
  items: Array<Products>;
  total: Scalars['Float']['output'];
};

export type ProductCharacteristics = {
  __typename?: 'ProductCharacteristics';
  characteristic: CharacteristicDefinitions;
  characteristicId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  product: Products;
  productId?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
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
  categories: Array<Categories>;
  contact: Contacts;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  histories: Array<History>;
  id: Scalars['String']['output'];
  images: Array<Images>;
  label?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['String']['output'];
  productCharacteristics: Array<ProductCharacteristics>;
  reference: Scalars['String']['output'];
  shortDescription?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  tags: Array<Tags>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type Query = {
  __typename?: 'Query';
  brand?: Maybe<Brands>;
  brands: Array<Brands>;
  dashboardStats: DashboardStats;
  product?: Maybe<Products>;
  products: PaginatedProductsResponse;
  searchProducts: PaginatedProductsResponse;
  searchProductsSuggestions: Array<Products>;
  totalBrands: Scalars['Int']['output'];
};

export type QueryBrandArgs = {
  id: Scalars['String']['input'];
};

export type QueryBrandsArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};

export type QueryProductArgs = {
  id: Scalars['String']['input'];
};

export type QueryProductsArgs = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
};

export type QuerySearchProductsArgs = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  query: Scalars['String']['input'];
};

export type QuerySearchProductsSuggestionsArgs = {
  limit?: Scalars['Int']['input'];
  query: Scalars['String']['input'];
};

export type QueryTotalBrandsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Tags = {
  __typename?: 'Tags';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  products: Products;
};

export type Users = {
  __typename?: 'Users';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  email: Scalars['String']['output'];
  endDate?: Maybe<Scalars['DateTimeISO']['output']>;
  exchanges: Exchanges;
  firstName: Scalars['String']['output'];
  histories: History;
  id: Scalars['String']['output'];
  isAdmin: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  password: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  startDate: Scalars['DateTimeISO']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type GetBrandsQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetBrandsQuery = {
  __typename?: 'Query';
  totalBrands: number;
  brands: Array<{
    __typename?: 'Brands';
    id: string;
    name: string;
    description?: string | null;
    logo?: string | null;
    createdAt?: Date | null;
    totalProducts: number;
    contacts: Array<{
      __typename?: 'Contacts';
      id: string;
      email?: string | null;
      phone?: string | null;
      country?: string | null;
    }>;
    products?: Array<{
      __typename?: 'Products';
      id: string;
      name: string;
    }> | null;
  }>;
};

export type GetBrandQueryVariables = Exact<{
  brandId: Scalars['String']['input'];
  contactLimit?: InputMaybe<Scalars['Int']['input']>;
  contactOffset?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetBrandQuery = {
  __typename?: 'Query';
  brand?: {
    __typename?: 'Brands';
    id: string;
    name: string;
    logo?: string | null;
    description?: string | null;
    totalProducts: number;
    totalContacts: number;
    contacts: Array<{
      __typename?: 'Contacts';
      id: string;
      email?: string | null;
      phone?: string | null;
      country?: string | null;
      totalProducts: number;
    }>;
    products?: Array<{
      __typename?: 'Products';
      id: string;
      name: string;
    }> | null;
  } | null;
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
  products: {
    __typename?: 'PaginatedProductsResponse';
    total: number;
    hasMore: boolean;
    items: Array<{
      __typename?: 'Products';
      id: string;
      name: string;
      reference: string;
      price: string;
      status: string;
      label?: string | null;
      createdAt?: Date | null;
      brand: { __typename?: 'Brands'; name: string };
    }>;
  };
};

export type SearchProductsQueryVariables = Exact<{
  query: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type SearchProductsQuery = {
  __typename?: 'Query';
  searchProducts: {
    __typename?: 'PaginatedProductsResponse';
    total: number;
    hasMore: boolean;
    items: Array<{
      __typename?: 'Products';
      id: string;
      name: string;
      reference: string;
      price: string;
      status: string;
      label?: string | null;
      createdAt?: Date | null;
      brand: { __typename?: 'Brands'; name: string };
    }>;
  };
};

export type GetProductQueryVariables = Exact<{
  productId: Scalars['String']['input'];
}>;

export type GetProductQuery = {
  __typename?: 'Query';
  product?: {
    __typename?: 'Products';
    id: string;
    name: string;
    reference: string;
    shortDescription?: string | null;
    description?: string | null;
    price: string;
    status: string;
    label?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    brand: { __typename?: 'Brands'; id: string; name: string };
    contact: {
      __typename?: 'Contacts';
      email?: string | null;
      phone?: string | null;
      country?: string | null;
    };
    categories: Array<{ __typename?: 'Categories'; id: string; name: string }>;
    tags: Array<{ __typename?: 'Tags'; id: string; name: string }>;
    images: Array<{
      __typename?: 'Images';
      id: string;
      url: string;
      altText?: string | null;
      isPrimary: boolean;
    }>;
    productCharacteristics: Array<{
      __typename?: 'ProductCharacteristics';
      id: string;
      value: string;
      characteristic: {
        __typename?: 'CharacteristicDefinitions';
        id: string;
        name: string;
      };
    }>;
  } | null;
};

export const GetBrandsDocument = gql`
  query getBrands($limit: Int!, $page: Int!, $search: String) {
    brands(limit: $limit, page: $page, search: $search) {
      id
      name
      description
      logo
      createdAt
      totalProducts
      contacts {
        id
        email
        phone
        country
      }
      products {
        id
        name
      }
    }
    totalBrands
  }
`;

/**
 * __useGetBrandsQuery__
 *
 * To run a query within a React component, call `useGetBrandsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBrandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBrandsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useGetBrandsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetBrandsQuery,
    GetBrandsQueryVariables
  > &
    ({ variables: GetBrandsQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetBrandsQuery, GetBrandsQueryVariables>(
    GetBrandsDocument,
    options
  );
}
export function useGetBrandsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBrandsQuery,
    GetBrandsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetBrandsQuery, GetBrandsQueryVariables>(
    GetBrandsDocument,
    options
  );
}
export function useGetBrandsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetBrandsQuery, GetBrandsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetBrandsQuery, GetBrandsQueryVariables>(
    GetBrandsDocument,
    options
  );
}
export type GetBrandsQueryHookResult = ReturnType<typeof useGetBrandsQuery>;
export type GetBrandsLazyQueryHookResult = ReturnType<
  typeof useGetBrandsLazyQuery
>;
export type GetBrandsSuspenseQueryHookResult = ReturnType<
  typeof useGetBrandsSuspenseQuery
>;
export type GetBrandsQueryResult = Apollo.QueryResult<
  GetBrandsQuery,
  GetBrandsQueryVariables
>;
export const GetBrandDocument = gql`
  query getBrand($brandId: String!, $contactLimit: Int, $contactOffset: Int) {
    brand(id: $brandId) {
      id
      name
      logo
      description
      totalProducts
      totalContacts
      contacts(contactLimit: $contactLimit, contactOffset: $contactOffset) {
        id
        email
        phone
        country
        totalProducts
      }
      products {
        id
        name
      }
    }
  }
`;

/**
 * __useGetBrandQuery__
 *
 * To run a query within a React component, call `useGetBrandQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBrandQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBrandQuery({
 *   variables: {
 *      brandId: // value for 'brandId'
 *      contactLimit: // value for 'contactLimit'
 *      contactOffset: // value for 'contactOffset'
 *   },
 * });
 */
export function useGetBrandQuery(
  baseOptions: Apollo.QueryHookOptions<GetBrandQuery, GetBrandQueryVariables> &
    ({ variables: GetBrandQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetBrandQuery, GetBrandQueryVariables>(
    GetBrandDocument,
    options
  );
}
export function useGetBrandLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBrandQuery,
    GetBrandQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetBrandQuery, GetBrandQueryVariables>(
    GetBrandDocument,
    options
  );
}
export function useGetBrandSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetBrandQuery, GetBrandQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetBrandQuery, GetBrandQueryVariables>(
    GetBrandDocument,
    options
  );
}
export type GetBrandQueryHookResult = ReturnType<typeof useGetBrandQuery>;
export type GetBrandLazyQueryHookResult = ReturnType<
  typeof useGetBrandLazyQuery
>;
export type GetBrandSuspenseQueryHookResult = ReturnType<
  typeof useGetBrandSuspenseQuery
>;
export type GetBrandQueryResult = Apollo.QueryResult<
  GetBrandQuery,
  GetBrandQueryVariables
>;
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
      items {
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
      total
      hasMore
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
export const SearchProductsDocument = gql`
  query SearchProducts($query: String!, $page: Int, $limit: Int) {
    searchProducts(query: $query, page: $page, limit: $limit) {
      items {
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
      total
      hasMore
    }
  }
`;

/**
 * __useSearchProductsQuery__
 *
 * To run a query within a React component, call `useSearchProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProductsQuery({
 *   variables: {
 *      query: // value for 'query'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchProductsQuery(
  baseOptions: Apollo.QueryHookOptions<
    SearchProductsQuery,
    SearchProductsQueryVariables
  > &
    (
      | { variables: SearchProductsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SearchProductsQuery, SearchProductsQueryVariables>(
    SearchProductsDocument,
    options
  );
}
export function useSearchProductsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SearchProductsQuery,
    SearchProductsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SearchProductsQuery, SearchProductsQueryVariables>(
    SearchProductsDocument,
    options
  );
}
export function useSearchProductsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        SearchProductsQuery,
        SearchProductsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SearchProductsQuery,
    SearchProductsQueryVariables
  >(SearchProductsDocument, options);
}
export type SearchProductsQueryHookResult = ReturnType<
  typeof useSearchProductsQuery
>;
export type SearchProductsLazyQueryHookResult = ReturnType<
  typeof useSearchProductsLazyQuery
>;
export type SearchProductsSuspenseQueryHookResult = ReturnType<
  typeof useSearchProductsSuspenseQuery
>;
export type SearchProductsQueryResult = Apollo.QueryResult<
  SearchProductsQuery,
  SearchProductsQueryVariables
>;
export const GetProductDocument = gql`
  query GetProduct($productId: String!) {
    product(id: $productId) {
      id
      name
      reference
      shortDescription
      description
      price
      status
      label
      createdAt
      updatedAt
      deletedAt
      brand {
        id
        name
      }
      contact {
        email
        phone
        country
      }
      categories {
        id
        name
      }
      tags {
        id
        name
      }
      images {
        id
        url
        altText
        isPrimary
      }
      productCharacteristics {
        id
        characteristic {
          id
          name
        }
        value
      }
    }
  }
`;

/**
 * __useGetProductQuery__
 *
 * To run a query within a React component, call `useGetProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductQuery({
 *   variables: {
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useGetProductQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetProductQuery,
    GetProductQueryVariables
  > &
    (
      | { variables: GetProductQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProductQuery, GetProductQueryVariables>(
    GetProductDocument,
    options
  );
}
export function useGetProductLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProductQuery,
    GetProductQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProductQuery, GetProductQueryVariables>(
    GetProductDocument,
    options
  );
}
export function useGetProductSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetProductQuery, GetProductQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetProductQuery, GetProductQueryVariables>(
    GetProductDocument,
    options
  );
}
export type GetProductQueryHookResult = ReturnType<typeof useGetProductQuery>;
export type GetProductLazyQueryHookResult = ReturnType<
  typeof useGetProductLazyQuery
>;
export type GetProductSuspenseQueryHookResult = ReturnType<
  typeof useGetProductSuspenseQuery
>;
export type GetProductQueryResult = Apollo.QueryResult<
  GetProductQuery,
  GetProductQueryVariables
>;
