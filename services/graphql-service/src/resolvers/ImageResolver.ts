import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { AppDataSource } from '../config/database';
import { Images } from '../entities/Images';
import { Service } from 'typedi';
import { Context } from '../types/Context';

@Service()
@Resolver(Images)
export class ImageResolver {
  @Mutation(() => Boolean)
  async removeProductImage(
    @Arg('productId') productId: string,
    @Arg('imageId') imageId: string,
    @Ctx() context: Context
  ): Promise<boolean> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Récupérer l'image pour avoir l'URL
      const image = await queryRunner.manager.findOne(Images, {
        where: { id: imageId },
      });

      if (!image) {
        throw new Error('Image not found');
      }

      // 2. Supprimer la relation
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from('product_images')
        .where('product_id = :productId AND image_id = :imageId', {
          productId,
          imageId,
        })
        .execute();

      // 3. Vérifier si l'image est encore utilisée ailleurs
      const imageUsageCount = await queryRunner.manager
        .createQueryBuilder()
        .select('COUNT(*)', 'count')
        .from('product_images', 'pi')
        .where('pi.image_id = :imageId', { imageId })
        .getRawOne();

      // 4. Si l'image n'est plus utilisée, supprimer le fichier physique et l'entrée en BDD
      if (imageUsageCount.count === '0') {
        try {
          // Supprimer le fichier physique via le service upload
          const response = await fetch(
            `http://upload:3003/upload/images/${image.url}`,
            {
              method: 'DELETE',
              headers: context.req.headers.cookie
                ? { Cookie: context.req.headers.cookie }
                : undefined,
            }
          );

          if (!response.ok) {
            throw new Error('Failed to delete image file');
          }

          // Si la suppression physique a réussi, supprimer l'entrée en BDD
          await queryRunner.manager.delete(Images, { id: imageId });
        } catch (error) {
          console.error('Failed to delete image file:', error);
          throw new Error('Failed to delete image file');
        }
      }

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.error('Error in removeProductImage:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
