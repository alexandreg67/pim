import { Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { AuthRequest } from '../middlewares/auth.middleware';

class UploadController {
  async uploadImage(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const file = req.file;
      const uploadType = req.params.type || 'images';

      // Utiliser le même chemin que multer
      const inputPath = file.path; // Déjà dans /storage/assets/images
      const outputPath = inputPath.replace(path.extname(inputPath), '.jpg');

      // Traitement de l'image
      await sharp(inputPath)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toFile(outputPath + '.tmp');

      // Remplacer le fichier original par la version optimisée
      await fs.unlink(inputPath);
      await fs.rename(outputPath + '.tmp', outputPath);

      const filename = path.basename(outputPath);
      const response = {
        url: `/assets/${uploadType}/${filename}`,
        filename: filename,
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        message: 'Error processing upload',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async deleteImage(req: AuthRequest, res: Response) {
    try {
      const { filename } = req.params;
      const uploadType = req.params.type || 'images';
      const filePath = `/storage/assets/${uploadType}/${filename}`;

      await fs.unlink(filePath);
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ message: 'Error deleting file' });
    }
  }
}

export const uploadController = new UploadController();
