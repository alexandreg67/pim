import {
  Resolver,
  Query,
  Arg,
  Int,
  ObjectType,
  Field,
  Mutation,
  InputType,
  Ctx,
  Authorized,
} from 'type-graphql';
import { Products } from '../entities/Products';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { Categories } from '../entities/Categories';
import { Tags } from '../entities/Tags';
import { Context } from '../types/Context';
import { HistoryService } from '../services/HistoryService';
import { Service } from 'typedi';
import { Actions } from '../entities/Actions';
import { Brands } from '../entities/Brands';
import { Contacts } from '../entities/Contacts';
import { Images } from '../entities/Images';

@ObjectType()
class PaginatedProductsResponse {
  @Field(() => [Products])
  items: Products[];

  @Field()
  total: number;

  @Field()
  hasMore: boolean;
}

@InputType()
class UpdateProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  shortDescription?: string;

  @Field({ nullable: true })
  price?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  label?: string;

  // Relations
  @Field(() => [String], { nullable: true })
  categoryIds?: string[];

  @Field(() => [String], { nullable: true })
  tagIds?: string[];
}

@InputType()
class CreateProductInput {
  @Field()
  name: string;

  @Field()
  reference: string;

  @Field()
  price: string;

  @Field()
  brandId: string;

  @Field()
  contactId: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  shortDescription?: string;

  @Field(() => String, { defaultValue: 'draft' })
  status: string;

  @Field({ nullable: true })
  label?: string;

  @Field(() => [String], { nullable: true })
  categoryIds?: string[];

  @Field(() => [String], { nullable: true })
  tagIds?: string[];
}

@InputType()
class AddProductImageInput {
  @Field()
  productId: string;

  @Field()
  url: string;

  @Field({ nullable: true })
  altText?: string;

  @Field({ defaultValue: false })
  isPrimary: boolean;
}

@Service()
@Resolver(Products)
export default class ProductsResolver {
  constructor(private historyService: HistoryService) {}
  @Query(() => PaginatedProductsResponse)
  @Authorized(['admin', 'collaborator'])
  async products(
    @Arg('page', () => Int, { defaultValue: 1 }) page: number,
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number,
    @Arg('query', () => String, { nullable: true }) query?: string,
    @Arg('status', () => String, { nullable: true }) status?: string
  ): Promise<PaginatedProductsResponse> {
    try {
      const offset = (page - 1) * limit;

      const where: FindOptionsWhere<Products> = {};

      if (status) {
        where.status = status;
      }

      if (query) {
        where.name = ILike(`%${query}%`);
      }

      const [items, total] = await Products.findAndCount({
        where,
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: {
          brand: true,
          categories: true,
          tags: true,
        },
      });

      return {
        items,
        total,
        hasMore: total > offset + items.length,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Unable to fetch products');
    }
  }

  // Query pour les suggestions de recherche (autocomplétion)
  @Query(() => [Products])
  @Authorized(['admin', 'collaborator'])
  async searchProductsSuggestions(
    @Arg('query') query: string,
    @Arg('limit', () => Int, { defaultValue: 5 }) limit: number
  ): Promise<Products[]> {
    try {
      return await Products.createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand')
        .where(`product.search_vector @@ plainto_tsquery('french', :query)`, {
          query,
        })
        .orderBy(
          `ts_rank(product.search_vector, plainto_tsquery('french', :query))`,
          'DESC'
        )
        .take(limit)
        .getMany();
    } catch (error) {
      console.error('Error fetching product suggestions:', error);
      throw new Error('Unable to fetch product suggestions');
    }
  }

  @Query(() => Products, { nullable: true })
  @Authorized(['admin', 'collaborator'])
  async product(@Arg('id', () => String) id: string): Promise<Products | null> {
    try {
      const product = await Products.findOne({
        where: { id },
        relations: [
          'brand',
          'productCharacteristics',
          'productCharacteristics.characteristic',
          'images',
          'categories',
          'tags',
          'contact',
        ],
      });

      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }

      return product;
    } catch (error) {
      console.error(`❌ Error fetching product by ID: ${error}`);
      throw new Error('Unable to fetch product');
    }
  }

  @Mutation(() => Products)
  @Authorized(['admin', 'collaborator'])
  async updateProduct(
    @Arg('id') id: string,
    @Arg('input') input: UpdateProductInput,
    @Ctx() { user }: Context
  ): Promise<Products> {
    if (!user) {
      throw new Error('Authentication required');
    }

    try {
      // 1. Récupérer le produit
      const product = await Products.findOne({
        where: { id },
        relations: ['categories', 'tags'],
      });

      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }

      // 2. Mise à jour des relations si fournies
      if (input.categoryIds) {
        product.categories = await Categories.findBy({
          id: In(input.categoryIds),
        });
      }

      if (input.tagIds) {
        product.tags = await Tags.findBy({
          id: In(input.tagIds),
        });
      }

      // 3. Mise à jour des champs simples
      Object.assign(product, input);

      // 4. Sauvegarder les modifications
      const updatedProduct = await product.save();

      // 5. Récupérer l'action
      const updateAction = await Actions.findOne({
        where: { name: 'UPDATE_PRODUCT' },
      });

      if (!updateAction) {
        throw new Error('Update action not found');
      }

      // 5. Créer l'historique
      await this.historyService.createHistory({
        user,
        action: updateAction,
        productId: product.id,
      });

      return updatedProduct;
    } catch (error) {
      throw new Error(`Failed to update product: ${error}`);
    }
  }

  @Mutation(() => Boolean)
  @Authorized(['admin', 'collaborator'])
  async deleteProduct(
    @Arg('id') id: string,
    @Ctx() { user }: Context
  ): Promise<boolean> {
    if (!user) {
      throw new Error('Authentication required');
    }

    try {
      const product = await Products.findOne({
        where: { id },
        relations: ['brand'],
      });

      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }

      const deleteAction = await Actions.findOne({
        where: { name: 'DELETE_PRODUCT' },
      });

      if (!deleteAction) {
        throw new Error('Delete action not found');
      }

      // Stocker les infos avant suppression
      const productMetadata = {
        name: product.name,
        reference: product.reference,
      };

      await this.historyService.createHistory({
        user,
        action: deleteAction,
        productId: product.id,
        metadata: productMetadata,
      });

      await product.softRemove();

      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error(`Failed to delete product: ${error}`);
    }
  }

  @Mutation(() => Products)
  @Authorized(['admin', 'collaborator'])
  async createProduct(
    @Arg('input') input: CreateProductInput,
    @Ctx() { user }: Context
  ): Promise<Products> {
    if (!user) {
      throw new Error('Authentication required');
    }

    try {
      const product = new Products();

      // Assign simple fields
      Object.assign(product, {
        ...input,
        status: input.status || 'draft',
      });

      // Set relations
      if (input.brandId) {
        product.brand = await Brands.findOneByOrFail({ id: input.brandId });
      }

      if (input.contactId) {
        product.contact = await Contacts.findOneByOrFail({
          id: input.contactId,
        });
      }

      if (input.categoryIds?.length) {
        product.categories = await Categories.findBy({
          id: In(input.categoryIds),
        });
      }

      if (input.tagIds?.length) {
        product.tags = await Tags.findBy({ id: In(input.tagIds) });
      }

      const savedProduct = await product.save();

      // Create history entry
      const createAction = await Actions.findOneByOrFail({
        name: 'CREATE_PRODUCT',
      });
      await this.historyService.createHistory({
        user,
        action: createAction,
        productId: savedProduct.id,
      });

      return savedProduct;
    } catch (error) {
      throw new Error(`Failed to create product: ${error}`);
    }
  }

  @Mutation(() => Products)
  @Authorized(['admin', 'collaborator'])
  async addProductImage(
    @Arg('input') input: AddProductImageInput,
    @Ctx() { user }: Context
  ): Promise<Products> {
    if (!user) {
      throw new Error('Authentication required');
    }

    try {
      // Vérifier si le produit existe
      const product = await Products.findOne({
        where: { id: input.productId },
        relations: ['images'],
      });

      if (!product) {
        throw new Error('Product not found');
      }

      // Si c'est une image principale, mettre à jour les autres images
      if (input.isPrimary) {
        await Images.createQueryBuilder()
          .update()
          .set({ isPrimary: false })
          .where(
            'id IN (SELECT image_id FROM product_images WHERE product_id = :productId)',
            { productId: product.id }
          )
          .execute();
      }

      // Créer une nouvelle image
      const image = new Images();
      image.url = input.url;
      image.altText = input.altText || '';
      image.isPrimary = input.isPrimary;

      // Sauvegarder l'image
      await image.save();

      // Associer l'image au produit
      if (!product.images) {
        product.images = [];
      }
      product.images.push(image);
      await product.save();

      return product;
    } catch (error) {
      console.error('Error adding image:', error);
      throw new Error(`Failed to add image to product: ${error}`);
    }
  }
}
