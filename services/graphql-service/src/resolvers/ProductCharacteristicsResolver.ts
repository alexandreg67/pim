import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { ProductCharacteristics } from '../entities/ProductCharacteristics';
import { Products } from '../entities/Products';
import { Context } from '../types/Context';
import { Service } from 'typedi';

@Service()
@Resolver(ProductCharacteristics)
export class ProductCharacteristicsResolver {
  @Mutation(() => Products)
  async addProductCharacteristic(
    @Arg('productId') productId: string,
    @Arg('characteristicId') characteristicId: string,
    @Arg('value') value: string,
    @Ctx() { user }: Context
  ): Promise<Products> {
    if (!user) {
      throw new Error('Authentication required');
    }

    const product = await Products.findOne({
      where: { id: productId },
      relations: ['productCharacteristics'],
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Vérifier si la caractéristique n'existe pas déjà
    const exists = await ProductCharacteristics.findOne({
      where: {
        productId,
        characteristicId,
      },
    });

    if (exists) {
      throw new Error('This characteristic already exists for this product');
    }

    // Ajouter la nouvelle caractéristique
    const characteristic = new ProductCharacteristics();
    characteristic.productId = productId;
    characteristic.characteristicId = characteristicId;
    characteristic.value = value;
    await characteristic.save();

    const updatedProduct = await Products.findOne({
      where: { id: productId },
      relations: [
        'productCharacteristics',
        'productCharacteristics.characteristic',
      ],
    });

    if (!updatedProduct) {
      throw new Error('Product not found');
    }

    return updatedProduct;
  }

  @Mutation(() => Products)
  async updateProductCharacteristicValue(
    @Arg('productId') productId: string,
    @Arg('characteristicId') characteristicId: string,
    @Arg('value') value: string,
    @Ctx() { user }: Context
  ): Promise<Products> {
    if (!user) {
      throw new Error('Authentication required');
    }

    const characteristic = await ProductCharacteristics.findOne({
      where: {
        productId,
        characteristicId,
      },
    });

    if (!characteristic) {
      throw new Error('Characteristic not found');
    }

    characteristic.value = value;
    await characteristic.save();

    const updatedProduct = await Products.findOne({
      where: { id: productId },
      relations: [
        'productCharacteristics',
        'productCharacteristics.characteristic',
      ],
    });

    if (!updatedProduct) {
      throw new Error('Product not found');
    }

    return updatedProduct;
  }

  @Mutation(() => Products)
  async removeProductCharacteristic(
    @Arg('productId') productId: string,
    @Arg('characteristicId') characteristicId: string,
    @Ctx() { user }: Context
  ): Promise<Products> {
    if (!user) {
      throw new Error('Authentication required');
    }

    await ProductCharacteristics.delete({
      productId,
      characteristicId,
    });

    const updatedProduct = await Products.findOne({
      where: { id: productId },
      relations: [
        'productCharacteristics',
        'productCharacteristics.characteristic',
      ],
    });

    if (!updatedProduct) {
      throw new Error('Product not found');
    }

    return updatedProduct;
  }
}
