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
  JSONObject: {
    input: Record<string, unknown>;
    output: Record<string, unknown>;
  };
};

/** Les différents types d'actions possibles dans le PIM */
export enum ActionType {
  Category = 'CATEGORY',
  Characteristic = 'CHARACTERISTIC',
  Media = 'MEDIA',
  Product = 'PRODUCT',
  Tag = 'TAG',
  Workflow = 'WORKFLOW',
}

export type Actions = {
  __typename?: 'Actions';
  active: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  histories: Array<History>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: ActionType;
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
  countryFilter?: InputMaybe<Scalars['String']['input']>;
};

export type BrandsTotalContactsArgs = {
  countryFilter?: InputMaybe<Scalars['String']['input']>;
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

export type CreateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateTagInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
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
  details?: Maybe<Scalars['JSONObject']['output']>;
  id: Scalars['String']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  product: Products;
  productId: Scalars['String']['output'];
  user: Users;
  userAgent?: Maybe<Scalars['String']['output']>;
  userId: Scalars['String']['output'];
};

export type HistoryEntry = {
  __typename?: 'HistoryEntry';
  action: Actions;
  createdAt: Scalars['DateTime']['output'];
  product?: Maybe<Products>;
  user?: Maybe<Users>;
};

export type Images = {
  __typename?: 'Images';
  altText?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isPrimary: Scalars['Boolean']['output'];
  products: Products;
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addProductCharacteristic: Products;
  createCategory: Categories;
  createTag: Tags;
  deleteCategory: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteTag: Scalars['Boolean']['output'];
  removeProductCharacteristic: Products;
  resetUserPassword: Scalars['Boolean']['output'];
  updateCategory: Categories;
  updateProduct: Products;
  updateProductCharacteristicValue: Products;
  updateTag: Tags;
  updateUser: Users;
};

export type MutationAddProductCharacteristicArgs = {
  characteristicId: Scalars['String']['input'];
  productId: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};

export type MutationCreateTagArgs = {
  input: CreateTagInput;
};

export type MutationDeleteCategoryArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeleteProductArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeleteTagArgs = {
  id: Scalars['String']['input'];
};

export type MutationRemoveProductCharacteristicArgs = {
  characteristicId: Scalars['String']['input'];
  productId: Scalars['String']['input'];
};

export type MutationResetUserPasswordArgs = {
  userId: Scalars['String']['input'];
};

export type MutationUpdateCategoryArgs = {
  id: Scalars['String']['input'];
  input: UpdateCategoryInput;
};

export type MutationUpdateProductArgs = {
  id: Scalars['String']['input'];
  input: UpdateProductInput;
};

export type MutationUpdateProductCharacteristicValueArgs = {
  characteristicId: Scalars['String']['input'];
  productId: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type MutationUpdateTagArgs = {
  id: Scalars['String']['input'];
  input: UpdateTagInput;
};

export type MutationUpdateUserArgs = {
  id: Scalars['String']['input'];
  input: UpdateUserInput;
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
  brandCountries: Array<Scalars['String']['output']>;
  brands: Array<Brands>;
  brandsForFilter: Array<Brands>;
  categories: Array<Categories>;
  characteristicDefinition?: Maybe<CharacteristicDefinitions>;
  characteristicDefinitions: Array<CharacteristicDefinitions>;
  dashboardStats: DashboardStats;
  getHistory: Array<History>;
  product?: Maybe<Products>;
  productTags: Array<Tags>;
  products: PaginatedProductsResponse;
  searchProductsSuggestions: Array<Products>;
  tag?: Maybe<Tags>;
  tags: Array<Tags>;
  totalBrands: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
  user?: Maybe<Users>;
  users: Array<Users>;
};

export type QueryBrandArgs = {
  id: Scalars['String']['input'];
};

export type QueryBrandCountriesArgs = {
  brandId: Scalars['String']['input'];
};

export type QueryBrandsArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};

export type QueryCharacteristicDefinitionArgs = {
  id: Scalars['ID']['input'];
};

export type QueryProductArgs = {
  id: Scalars['String']['input'];
};

export type QueryProductTagsArgs = {
  productId: Scalars['ID']['input'];
};

export type QueryProductsArgs = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  query?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type QuerySearchProductsSuggestionsArgs = {
  limit?: Scalars['Int']['input'];
  query: Scalars['String']['input'];
};

export type QueryTagArgs = {
  id: Scalars['ID']['input'];
};

export type QueryTotalBrandsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};

export type QueryUserArgs = {
  id: Scalars['String']['input'];
};

export type QueryUsersArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};

export type Tags = {
  __typename?: 'Tags';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  products: Products;
};

export type UpdateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type UpdateProductInput = {
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tagIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateTagInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type UpdateUserInput = {
  endDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['DateTimeISO']['input'];
};

/** Les différents rôles utilisateur */
export enum UserRole {
  Admin = 'ADMIN',
  Collaborator = 'COLLABORATOR',
  SuperAdmin = 'SUPER_ADMIN',
}

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
  isActive: Scalars['Boolean']['output'];
  isFirstLogin: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  role: UserRole;
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
  countryFilter?: InputMaybe<Scalars['String']['input']>;
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

export type GetBrandCountriesQueryVariables = Exact<{
  brandId: Scalars['String']['input'];
}>;

export type GetBrandCountriesQuery = {
  __typename?: 'Query';
  brandCountries: Array<string>;
};

export type GetBrandsForFilterQueryVariables = Exact<{ [key: string]: never }>;

export type GetBrandsForFilterQuery = {
  __typename?: 'Query';
  brandsForFilter: Array<{ __typename?: 'Brands'; id: string; name: string }>;
};

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;

export type CreateCategoryMutation = {
  __typename?: 'Mutation';
  createCategory: {
    __typename?: 'Categories';
    id: string;
    name: string;
    description?: string | null;
  };
};

export type CategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type CategoriesQuery = {
  __typename?: 'Query';
  categories: Array<{
    __typename?: 'Categories';
    id: string;
    name: string;
    description?: string | null;
  }>;
};

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteCategoryMutation = {
  __typename?: 'Mutation';
  deleteCategory: boolean;
};

export type UpdateCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateCategoryInput;
}>;

export type UpdateCategoryMutation = {
  __typename?: 'Mutation';
  updateCategory: {
    __typename?: 'Categories';
    id: string;
    name: string;
    description?: string | null;
  };
};

export type AddProductCharacteristicMutationVariables = Exact<{
  productId: Scalars['String']['input'];
  characteristicId: Scalars['String']['input'];
  value: Scalars['String']['input'];
}>;

export type AddProductCharacteristicMutation = {
  __typename?: 'Mutation';
  addProductCharacteristic: {
    __typename?: 'Products';
    id: string;
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
  };
};

export type UpdateProductCharacteristicMutationVariables = Exact<{
  productId: Scalars['String']['input'];
  characteristicId: Scalars['String']['input'];
  value: Scalars['String']['input'];
}>;

export type UpdateProductCharacteristicMutation = {
  __typename?: 'Mutation';
  updateProductCharacteristicValue: {
    __typename?: 'Products';
    id: string;
    productCharacteristics: Array<{
      __typename?: 'ProductCharacteristics';
      id: string;
      value: string;
      characteristic: {
        __typename?: 'CharacteristicDefinitions';
        name: string;
      };
    }>;
  };
};

export type RemoveProductCharacteristicMutationVariables = Exact<{
  productId: Scalars['String']['input'];
  characteristicId: Scalars['String']['input'];
}>;

export type RemoveProductCharacteristicMutation = {
  __typename?: 'Mutation';
  removeProductCharacteristic: {
    __typename?: 'Products';
    id: string;
    productCharacteristics: Array<{
      __typename?: 'ProductCharacteristics';
      id: string;
      value: string;
      characteristic: {
        __typename?: 'CharacteristicDefinitions';
        name: string;
      };
    }>;
  };
};

export type GetCharacteristicDefinitionsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetCharacteristicDefinitionsQuery = {
  __typename?: 'Query';
  characteristicDefinitions: Array<{
    __typename?: 'CharacteristicDefinitions';
    id: string;
    name: string;
  }>;
};

export type GetCharacteristicDefinitionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetCharacteristicDefinitionQuery = {
  __typename?: 'Query';
  characteristicDefinition?: {
    __typename?: 'CharacteristicDefinitions';
    id: string;
    name: string;
    productCharacteristics: {
      __typename?: 'ProductCharacteristics';
      id: string;
      value: string;
    };
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
      createdAt: Date;
      action: {
        __typename?: 'Actions';
        name: string;
        description?: string | null;
        type: ActionType;
        active: boolean;
      };
      user?: {
        __typename?: 'Users';
        firstName: string;
        lastName: string;
      } | null;
      product?: {
        __typename?: 'Products';
        name: string;
        reference: string;
      } | null;
    }>;
  };
};

export type GetHistoryQueryVariables = Exact<{ [key: string]: never }>;

export type GetHistoryQuery = {
  __typename?: 'Query';
  getHistory: Array<{
    __typename?: 'History';
    id: string;
    createdAt?: Date | null;
    action: {
      __typename?: 'Actions';
      name: string;
      description?: string | null;
      type: ActionType;
    };
    user: { __typename?: 'Users'; firstName: string; lastName: string };
    product: { __typename?: 'Products'; name: string; reference: string };
  }>;
};

export type GetProductsQueryVariables = Exact<{
  status?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
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
      price: string;
      status: string;
      createdAt?: Date | null;
      updatedAt?: Date | null;
      shortDescription?: string | null;
      reference: string;
      categories: Array<{ __typename?: 'Categories'; name: string }>;
      tags: Array<{ __typename?: 'Tags'; name: string }>;
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

export type UpdateProductMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateProductInput;
}>;

export type UpdateProductMutation = {
  __typename?: 'Mutation';
  updateProduct: {
    __typename?: 'Products';
    id: string;
    name: string;
    shortDescription?: string | null;
    description?: string | null;
    categories: Array<{ __typename?: 'Categories'; id: string; name: string }>;
    tags: Array<{ __typename?: 'Tags'; id: string; name: string }>;
  };
};

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteProductMutation = {
  __typename?: 'Mutation';
  deleteProduct: boolean;
};

export type TagsQueryVariables = Exact<{ [key: string]: never }>;

export type TagsQuery = {
  __typename?: 'Query';
  tags: Array<{
    __typename?: 'Tags';
    id: string;
    name: string;
    description?: string | null;
  }>;
};

export type CreateTagMutationVariables = Exact<{
  input: CreateTagInput;
}>;

export type CreateTagMutation = {
  __typename?: 'Mutation';
  createTag: { __typename?: 'Tags'; name: string; description?: string | null };
};

export type UpdateTagMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateTagInput;
}>;

export type UpdateTagMutation = {
  __typename?: 'Mutation';
  updateTag: { __typename?: 'Tags'; name: string; description?: string | null };
};

export type DeleteTagMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteTagMutation = { __typename?: 'Mutation'; deleteTag: boolean };

export type GetUsersQueryVariables = Exact<{
  page: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
}>;

export type GetUsersQuery = {
  __typename?: 'Query';
  totalUsers: number;
  users: Array<{
    __typename?: 'Users';
    id: string;
    lastName: string;
    firstName: string;
    email: string;
    phone?: string | null;
    role: UserRole;
    isFirstLogin: boolean;
    startDate: Date;
    endDate?: Date | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    isActive: boolean;
  }>;
};

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateUserInput;
}>;

export type UpdateUserMutation = {
  __typename?: 'Mutation';
  updateUser: {
    __typename?: 'Users';
    id: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    startDate: Date;
    endDate?: Date | null;
    updatedAt?: Date | null;
    createdAt?: Date | null;
  };
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
  query getBrand(
    $brandId: String!
    $contactLimit: Int
    $contactOffset: Int
    $countryFilter: String
  ) {
    brand(id: $brandId) {
      id
      name
      logo
      description
      totalProducts
      totalContacts(countryFilter: $countryFilter)
      contacts(
        contactLimit: $contactLimit
        contactOffset: $contactOffset
        countryFilter: $countryFilter
      ) {
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
 *      countryFilter: // value for 'countryFilter'
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
export const GetBrandCountriesDocument = gql`
  query getBrandCountries($brandId: String!) {
    brandCountries(brandId: $brandId)
  }
`;

/**
 * __useGetBrandCountriesQuery__
 *
 * To run a query within a React component, call `useGetBrandCountriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBrandCountriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBrandCountriesQuery({
 *   variables: {
 *      brandId: // value for 'brandId'
 *   },
 * });
 */
export function useGetBrandCountriesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetBrandCountriesQuery,
    GetBrandCountriesQueryVariables
  > &
    (
      | { variables: GetBrandCountriesQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetBrandCountriesQuery,
    GetBrandCountriesQueryVariables
  >(GetBrandCountriesDocument, options);
}
export function useGetBrandCountriesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBrandCountriesQuery,
    GetBrandCountriesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetBrandCountriesQuery,
    GetBrandCountriesQueryVariables
  >(GetBrandCountriesDocument, options);
}
export function useGetBrandCountriesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetBrandCountriesQuery,
        GetBrandCountriesQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetBrandCountriesQuery,
    GetBrandCountriesQueryVariables
  >(GetBrandCountriesDocument, options);
}
export type GetBrandCountriesQueryHookResult = ReturnType<
  typeof useGetBrandCountriesQuery
>;
export type GetBrandCountriesLazyQueryHookResult = ReturnType<
  typeof useGetBrandCountriesLazyQuery
>;
export type GetBrandCountriesSuspenseQueryHookResult = ReturnType<
  typeof useGetBrandCountriesSuspenseQuery
>;
export type GetBrandCountriesQueryResult = Apollo.QueryResult<
  GetBrandCountriesQuery,
  GetBrandCountriesQueryVariables
>;
export const GetBrandsForFilterDocument = gql`
  query getBrandsForFilter {
    brandsForFilter {
      id
      name
    }
  }
`;

/**
 * __useGetBrandsForFilterQuery__
 *
 * To run a query within a React component, call `useGetBrandsForFilterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBrandsForFilterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBrandsForFilterQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBrandsForFilterQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetBrandsForFilterQuery,
    GetBrandsForFilterQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetBrandsForFilterQuery,
    GetBrandsForFilterQueryVariables
  >(GetBrandsForFilterDocument, options);
}
export function useGetBrandsForFilterLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBrandsForFilterQuery,
    GetBrandsForFilterQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetBrandsForFilterQuery,
    GetBrandsForFilterQueryVariables
  >(GetBrandsForFilterDocument, options);
}
export function useGetBrandsForFilterSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetBrandsForFilterQuery,
        GetBrandsForFilterQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetBrandsForFilterQuery,
    GetBrandsForFilterQueryVariables
  >(GetBrandsForFilterDocument, options);
}
export type GetBrandsForFilterQueryHookResult = ReturnType<
  typeof useGetBrandsForFilterQuery
>;
export type GetBrandsForFilterLazyQueryHookResult = ReturnType<
  typeof useGetBrandsForFilterLazyQuery
>;
export type GetBrandsForFilterSuspenseQueryHookResult = ReturnType<
  typeof useGetBrandsForFilterSuspenseQuery
>;
export type GetBrandsForFilterQueryResult = Apollo.QueryResult<
  GetBrandsForFilterQuery,
  GetBrandsForFilterQueryVariables
>;
export const CreateCategoryDocument = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      description
    }
  }
`;
export type CreateCategoryMutationFn = Apollo.MutationFunction<
  CreateCategoryMutation,
  CreateCategoryMutationVariables
>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCategoryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCategoryMutation,
    CreateCategoryMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateCategoryMutation,
    CreateCategoryMutationVariables
  >(CreateCategoryDocument, options);
}
export type CreateCategoryMutationHookResult = ReturnType<
  typeof useCreateCategoryMutation
>;
export type CreateCategoryMutationResult =
  Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<
  CreateCategoryMutation,
  CreateCategoryMutationVariables
>;
export const CategoriesDocument = gql`
  query Categories {
    categories {
      id
      name
      description
    }
  }
`;

/**
 * __useCategoriesQuery__
 *
 * To run a query within a React component, call `useCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCategoriesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    CategoriesQuery,
    CategoriesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CategoriesQuery, CategoriesQueryVariables>(
    CategoriesDocument,
    options
  );
}
export function useCategoriesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CategoriesQuery,
    CategoriesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CategoriesQuery, CategoriesQueryVariables>(
    CategoriesDocument,
    options
  );
}
export function useCategoriesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<CategoriesQuery, CategoriesQueryVariables>(
    CategoriesDocument,
    options
  );
}
export type CategoriesQueryHookResult = ReturnType<typeof useCategoriesQuery>;
export type CategoriesLazyQueryHookResult = ReturnType<
  typeof useCategoriesLazyQuery
>;
export type CategoriesSuspenseQueryHookResult = ReturnType<
  typeof useCategoriesSuspenseQuery
>;
export type CategoriesQueryResult = Apollo.QueryResult<
  CategoriesQuery,
  CategoriesQueryVariables
>;
export const DeleteCategoryDocument = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`;
export type DeleteCategoryMutationFn = Apollo.MutationFunction<
  DeleteCategoryMutation,
  DeleteCategoryMutationVariables
>;

/**
 * __useDeleteCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCategoryMutation, { data, loading, error }] = useDeleteCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCategoryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteCategoryMutation,
    DeleteCategoryMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteCategoryMutation,
    DeleteCategoryMutationVariables
  >(DeleteCategoryDocument, options);
}
export type DeleteCategoryMutationHookResult = ReturnType<
  typeof useDeleteCategoryMutation
>;
export type DeleteCategoryMutationResult =
  Apollo.MutationResult<DeleteCategoryMutation>;
export type DeleteCategoryMutationOptions = Apollo.BaseMutationOptions<
  DeleteCategoryMutation,
  DeleteCategoryMutationVariables
>;
export const UpdateCategoryDocument = gql`
  mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      description
    }
  }
`;
export type UpdateCategoryMutationFn = Apollo.MutationFunction<
  UpdateCategoryMutation,
  UpdateCategoryMutationVariables
>;

/**
 * __useUpdateCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCategoryMutation, { data, loading, error }] = useUpdateCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCategoryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCategoryMutation,
    UpdateCategoryMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCategoryMutation,
    UpdateCategoryMutationVariables
  >(UpdateCategoryDocument, options);
}
export type UpdateCategoryMutationHookResult = ReturnType<
  typeof useUpdateCategoryMutation
>;
export type UpdateCategoryMutationResult =
  Apollo.MutationResult<UpdateCategoryMutation>;
export type UpdateCategoryMutationOptions = Apollo.BaseMutationOptions<
  UpdateCategoryMutation,
  UpdateCategoryMutationVariables
>;
export const AddProductCharacteristicDocument = gql`
  mutation AddProductCharacteristic(
    $productId: String!
    $characteristicId: String!
    $value: String!
  ) {
    addProductCharacteristic(
      productId: $productId
      characteristicId: $characteristicId
      value: $value
    ) {
      id
      productCharacteristics {
        id
        value
        characteristic {
          id
          name
        }
      }
    }
  }
`;
export type AddProductCharacteristicMutationFn = Apollo.MutationFunction<
  AddProductCharacteristicMutation,
  AddProductCharacteristicMutationVariables
>;

/**
 * __useAddProductCharacteristicMutation__
 *
 * To run a mutation, you first call `useAddProductCharacteristicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProductCharacteristicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProductCharacteristicMutation, { data, loading, error }] = useAddProductCharacteristicMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *      characteristicId: // value for 'characteristicId'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useAddProductCharacteristicMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddProductCharacteristicMutation,
    AddProductCharacteristicMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddProductCharacteristicMutation,
    AddProductCharacteristicMutationVariables
  >(AddProductCharacteristicDocument, options);
}
export type AddProductCharacteristicMutationHookResult = ReturnType<
  typeof useAddProductCharacteristicMutation
>;
export type AddProductCharacteristicMutationResult =
  Apollo.MutationResult<AddProductCharacteristicMutation>;
export type AddProductCharacteristicMutationOptions =
  Apollo.BaseMutationOptions<
    AddProductCharacteristicMutation,
    AddProductCharacteristicMutationVariables
  >;
export const UpdateProductCharacteristicDocument = gql`
  mutation UpdateProductCharacteristic(
    $productId: String!
    $characteristicId: String!
    $value: String!
  ) {
    updateProductCharacteristicValue(
      productId: $productId
      characteristicId: $characteristicId
      value: $value
    ) {
      id
      productCharacteristics {
        id
        value
        characteristic {
          name
        }
      }
    }
  }
`;
export type UpdateProductCharacteristicMutationFn = Apollo.MutationFunction<
  UpdateProductCharacteristicMutation,
  UpdateProductCharacteristicMutationVariables
>;

/**
 * __useUpdateProductCharacteristicMutation__
 *
 * To run a mutation, you first call `useUpdateProductCharacteristicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductCharacteristicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductCharacteristicMutation, { data, loading, error }] = useUpdateProductCharacteristicMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *      characteristicId: // value for 'characteristicId'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useUpdateProductCharacteristicMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateProductCharacteristicMutation,
    UpdateProductCharacteristicMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateProductCharacteristicMutation,
    UpdateProductCharacteristicMutationVariables
  >(UpdateProductCharacteristicDocument, options);
}
export type UpdateProductCharacteristicMutationHookResult = ReturnType<
  typeof useUpdateProductCharacteristicMutation
>;
export type UpdateProductCharacteristicMutationResult =
  Apollo.MutationResult<UpdateProductCharacteristicMutation>;
export type UpdateProductCharacteristicMutationOptions =
  Apollo.BaseMutationOptions<
    UpdateProductCharacteristicMutation,
    UpdateProductCharacteristicMutationVariables
  >;
export const RemoveProductCharacteristicDocument = gql`
  mutation RemoveProductCharacteristic(
    $productId: String!
    $characteristicId: String!
  ) {
    removeProductCharacteristic(
      productId: $productId
      characteristicId: $characteristicId
    ) {
      id
      productCharacteristics {
        id
        value
        characteristic {
          name
        }
      }
    }
  }
`;
export type RemoveProductCharacteristicMutationFn = Apollo.MutationFunction<
  RemoveProductCharacteristicMutation,
  RemoveProductCharacteristicMutationVariables
>;

/**
 * __useRemoveProductCharacteristicMutation__
 *
 * To run a mutation, you first call `useRemoveProductCharacteristicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveProductCharacteristicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeProductCharacteristicMutation, { data, loading, error }] = useRemoveProductCharacteristicMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *      characteristicId: // value for 'characteristicId'
 *   },
 * });
 */
export function useRemoveProductCharacteristicMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveProductCharacteristicMutation,
    RemoveProductCharacteristicMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemoveProductCharacteristicMutation,
    RemoveProductCharacteristicMutationVariables
  >(RemoveProductCharacteristicDocument, options);
}
export type RemoveProductCharacteristicMutationHookResult = ReturnType<
  typeof useRemoveProductCharacteristicMutation
>;
export type RemoveProductCharacteristicMutationResult =
  Apollo.MutationResult<RemoveProductCharacteristicMutation>;
export type RemoveProductCharacteristicMutationOptions =
  Apollo.BaseMutationOptions<
    RemoveProductCharacteristicMutation,
    RemoveProductCharacteristicMutationVariables
  >;
export const GetCharacteristicDefinitionsDocument = gql`
  query GetCharacteristicDefinitions {
    characteristicDefinitions {
      id
      name
    }
  }
`;

/**
 * __useGetCharacteristicDefinitionsQuery__
 *
 * To run a query within a React component, call `useGetCharacteristicDefinitionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCharacteristicDefinitionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCharacteristicDefinitionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCharacteristicDefinitionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetCharacteristicDefinitionsQuery,
    GetCharacteristicDefinitionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetCharacteristicDefinitionsQuery,
    GetCharacteristicDefinitionsQueryVariables
  >(GetCharacteristicDefinitionsDocument, options);
}
export function useGetCharacteristicDefinitionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCharacteristicDefinitionsQuery,
    GetCharacteristicDefinitionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetCharacteristicDefinitionsQuery,
    GetCharacteristicDefinitionsQueryVariables
  >(GetCharacteristicDefinitionsDocument, options);
}
export function useGetCharacteristicDefinitionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetCharacteristicDefinitionsQuery,
        GetCharacteristicDefinitionsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetCharacteristicDefinitionsQuery,
    GetCharacteristicDefinitionsQueryVariables
  >(GetCharacteristicDefinitionsDocument, options);
}
export type GetCharacteristicDefinitionsQueryHookResult = ReturnType<
  typeof useGetCharacteristicDefinitionsQuery
>;
export type GetCharacteristicDefinitionsLazyQueryHookResult = ReturnType<
  typeof useGetCharacteristicDefinitionsLazyQuery
>;
export type GetCharacteristicDefinitionsSuspenseQueryHookResult = ReturnType<
  typeof useGetCharacteristicDefinitionsSuspenseQuery
>;
export type GetCharacteristicDefinitionsQueryResult = Apollo.QueryResult<
  GetCharacteristicDefinitionsQuery,
  GetCharacteristicDefinitionsQueryVariables
>;
export const GetCharacteristicDefinitionDocument = gql`
  query GetCharacteristicDefinition($id: ID!) {
    characteristicDefinition(id: $id) {
      id
      name
      productCharacteristics {
        id
        value
      }
    }
  }
`;

/**
 * __useGetCharacteristicDefinitionQuery__
 *
 * To run a query within a React component, call `useGetCharacteristicDefinitionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCharacteristicDefinitionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCharacteristicDefinitionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCharacteristicDefinitionQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetCharacteristicDefinitionQuery,
    GetCharacteristicDefinitionQueryVariables
  > &
    (
      | { variables: GetCharacteristicDefinitionQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetCharacteristicDefinitionQuery,
    GetCharacteristicDefinitionQueryVariables
  >(GetCharacteristicDefinitionDocument, options);
}
export function useGetCharacteristicDefinitionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCharacteristicDefinitionQuery,
    GetCharacteristicDefinitionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetCharacteristicDefinitionQuery,
    GetCharacteristicDefinitionQueryVariables
  >(GetCharacteristicDefinitionDocument, options);
}
export function useGetCharacteristicDefinitionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetCharacteristicDefinitionQuery,
        GetCharacteristicDefinitionQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetCharacteristicDefinitionQuery,
    GetCharacteristicDefinitionQueryVariables
  >(GetCharacteristicDefinitionDocument, options);
}
export type GetCharacteristicDefinitionQueryHookResult = ReturnType<
  typeof useGetCharacteristicDefinitionQuery
>;
export type GetCharacteristicDefinitionLazyQueryHookResult = ReturnType<
  typeof useGetCharacteristicDefinitionLazyQuery
>;
export type GetCharacteristicDefinitionSuspenseQueryHookResult = ReturnType<
  typeof useGetCharacteristicDefinitionSuspenseQuery
>;
export type GetCharacteristicDefinitionQueryResult = Apollo.QueryResult<
  GetCharacteristicDefinitionQuery,
  GetCharacteristicDefinitionQueryVariables
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
        action {
          name
          description
          type
          active
        }
        createdAt
        user {
          firstName
          lastName
        }
        product {
          name
          reference
        }
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
export const GetHistoryDocument = gql`
  query GetHistory {
    getHistory {
      id
      createdAt
      action {
        name
        description
        type
      }
      user {
        firstName
        lastName
      }
      product {
        name
        reference
      }
    }
  }
`;

/**
 * __useGetHistoryQuery__
 *
 * To run a query within a React component, call `useGetHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHistoryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetHistoryQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetHistoryQuery,
    GetHistoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetHistoryQuery, GetHistoryQueryVariables>(
    GetHistoryDocument,
    options
  );
}
export function useGetHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetHistoryQuery,
    GetHistoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetHistoryQuery, GetHistoryQueryVariables>(
    GetHistoryDocument,
    options
  );
}
export function useGetHistorySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetHistoryQuery, GetHistoryQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetHistoryQuery, GetHistoryQueryVariables>(
    GetHistoryDocument,
    options
  );
}
export type GetHistoryQueryHookResult = ReturnType<typeof useGetHistoryQuery>;
export type GetHistoryLazyQueryHookResult = ReturnType<
  typeof useGetHistoryLazyQuery
>;
export type GetHistorySuspenseQueryHookResult = ReturnType<
  typeof useGetHistorySuspenseQuery
>;
export type GetHistoryQueryResult = Apollo.QueryResult<
  GetHistoryQuery,
  GetHistoryQueryVariables
>;
export const GetProductsDocument = gql`
  query GetProducts(
    $status: String
    $query: String
    $limit: Int!
    $page: Int!
  ) {
    products(page: $page, limit: $limit, status: $status, query: $query) {
      items {
        id
        name
        price
        status
        createdAt
        updatedAt
        shortDescription
        reference
        categories {
          name
        }
        tags {
          name
        }
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
 *      status: // value for 'status'
 *      query: // value for 'query'
 *      limit: // value for 'limit'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useGetProductsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetProductsQuery,
    GetProductsQueryVariables
  > &
    (
      | { variables: GetProductsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
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
export const UpdateProductDocument = gql`
  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      shortDescription
      description
      categories {
        id
        name
      }
      tags {
        id
        name
      }
    }
  }
`;
export type UpdateProductMutationFn = Apollo.MutationFunction<
  UpdateProductMutation,
  UpdateProductMutationVariables
>;

/**
 * __useUpdateProductMutation__
 *
 * To run a mutation, you first call `useUpdateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductMutation, { data, loading, error }] = useUpdateProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateProductMutation,
    UpdateProductMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateProductMutation,
    UpdateProductMutationVariables
  >(UpdateProductDocument, options);
}
export type UpdateProductMutationHookResult = ReturnType<
  typeof useUpdateProductMutation
>;
export type UpdateProductMutationResult =
  Apollo.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<
  UpdateProductMutation,
  UpdateProductMutationVariables
>;
export const DeleteProductDocument = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;
export type DeleteProductMutationFn = Apollo.MutationFunction<
  DeleteProductMutation,
  DeleteProductMutationVariables
>;

/**
 * __useDeleteProductMutation__
 *
 * To run a mutation, you first call `useDeleteProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductMutation, { data, loading, error }] = useDeleteProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProductMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteProductMutation,
    DeleteProductMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteProductMutation,
    DeleteProductMutationVariables
  >(DeleteProductDocument, options);
}
export type DeleteProductMutationHookResult = ReturnType<
  typeof useDeleteProductMutation
>;
export type DeleteProductMutationResult =
  Apollo.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<
  DeleteProductMutation,
  DeleteProductMutationVariables
>;
export const TagsDocument = gql`
  query Tags {
    tags {
      id
      name
      description
    }
  }
`;

/**
 * __useTagsQuery__
 *
 * To run a query within a React component, call `useTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTagsQuery(
  baseOptions?: Apollo.QueryHookOptions<TagsQuery, TagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TagsQuery, TagsQueryVariables>(TagsDocument, options);
}
export function useTagsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TagsQuery, TagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TagsQuery, TagsQueryVariables>(
    TagsDocument,
    options
  );
}
export function useTagsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<TagsQuery, TagsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<TagsQuery, TagsQueryVariables>(
    TagsDocument,
    options
  );
}
export type TagsQueryHookResult = ReturnType<typeof useTagsQuery>;
export type TagsLazyQueryHookResult = ReturnType<typeof useTagsLazyQuery>;
export type TagsSuspenseQueryHookResult = ReturnType<
  typeof useTagsSuspenseQuery
>;
export type TagsQueryResult = Apollo.QueryResult<TagsQuery, TagsQueryVariables>;
export const CreateTagDocument = gql`
  mutation CreateTag($input: CreateTagInput!) {
    createTag(input: $input) {
      name
      description
    }
  }
`;
export type CreateTagMutationFn = Apollo.MutationFunction<
  CreateTagMutation,
  CreateTagMutationVariables
>;

/**
 * __useCreateTagMutation__
 *
 * To run a mutation, you first call `useCreateTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTagMutation, { data, loading, error }] = useCreateTagMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTagMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateTagMutation,
    CreateTagMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateTagMutation, CreateTagMutationVariables>(
    CreateTagDocument,
    options
  );
}
export type CreateTagMutationHookResult = ReturnType<
  typeof useCreateTagMutation
>;
export type CreateTagMutationResult = Apollo.MutationResult<CreateTagMutation>;
export type CreateTagMutationOptions = Apollo.BaseMutationOptions<
  CreateTagMutation,
  CreateTagMutationVariables
>;
export const UpdateTagDocument = gql`
  mutation UpdateTag($id: String!, $input: UpdateTagInput!) {
    updateTag(id: $id, input: $input) {
      name
      description
    }
  }
`;
export type UpdateTagMutationFn = Apollo.MutationFunction<
  UpdateTagMutation,
  UpdateTagMutationVariables
>;

/**
 * __useUpdateTagMutation__
 *
 * To run a mutation, you first call `useUpdateTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTagMutation, { data, loading, error }] = useUpdateTagMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTagMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateTagMutation,
    UpdateTagMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateTagMutation, UpdateTagMutationVariables>(
    UpdateTagDocument,
    options
  );
}
export type UpdateTagMutationHookResult = ReturnType<
  typeof useUpdateTagMutation
>;
export type UpdateTagMutationResult = Apollo.MutationResult<UpdateTagMutation>;
export type UpdateTagMutationOptions = Apollo.BaseMutationOptions<
  UpdateTagMutation,
  UpdateTagMutationVariables
>;
export const DeleteTagDocument = gql`
  mutation DeleteTag($id: String!) {
    deleteTag(id: $id)
  }
`;
export type DeleteTagMutationFn = Apollo.MutationFunction<
  DeleteTagMutation,
  DeleteTagMutationVariables
>;

/**
 * __useDeleteTagMutation__
 *
 * To run a mutation, you first call `useDeleteTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTagMutation, { data, loading, error }] = useDeleteTagMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTagMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteTagMutation,
    DeleteTagMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteTagMutation, DeleteTagMutationVariables>(
    DeleteTagDocument,
    options
  );
}
export type DeleteTagMutationHookResult = ReturnType<
  typeof useDeleteTagMutation
>;
export type DeleteTagMutationResult = Apollo.MutationResult<DeleteTagMutation>;
export type DeleteTagMutationOptions = Apollo.BaseMutationOptions<
  DeleteTagMutation,
  DeleteTagMutationVariables
>;
export const GetUsersDocument = gql`
  query GetUsers($page: Int!, $limit: Int!) {
    users(page: $page, limit: $limit) {
      id
      lastName
      firstName
      email
      phone
      role
      isFirstLogin
      startDate
      endDate
      createdAt
      updatedAt
      deletedAt
      isActive
    }
    totalUsers
  }
`;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetUsersQuery(
  baseOptions: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables> &
    ({ variables: GetUsersQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(
    GetUsersDocument,
    options
  );
}
export function useGetUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUsersQuery,
    GetUsersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(
    GetUsersDocument,
    options
  );
}
export function useGetUsersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetUsersQuery, GetUsersQueryVariables>(
    GetUsersDocument,
    options
  );
}
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<
  typeof useGetUsersLazyQuery
>;
export type GetUsersSuspenseQueryHookResult = ReturnType<
  typeof useGetUsersSuspenseQuery
>;
export type GetUsersQueryResult = Apollo.QueryResult<
  GetUsersQuery,
  GetUsersQueryVariables
>;
export const UpdateUserDocument = gql`
  mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      phone
      startDate
      endDate
      updatedAt
      createdAt
    }
  }
`;
export type UpdateUserMutationFn = Apollo.MutationFunction<
  UpdateUserMutation,
  UpdateUserMutationVariables
>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    UpdateUserDocument,
    options
  );
}
export type UpdateUserMutationHookResult = ReturnType<
  typeof useUpdateUserMutation
>;
export type UpdateUserMutationResult =
  Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<
  UpdateUserMutation,
  UpdateUserMutationVariables
>;
