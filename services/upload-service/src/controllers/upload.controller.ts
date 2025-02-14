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
        url: `${filename}`,
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

      const filepath = path.join('/storage/assets/images', filename);

      try {
        await fs.access(filepath);
      } catch {
        console.error(`File not found: ${filepath}`);
        res.status(404).json({ message: 'File not found' });
        return;
      }

      // Supprimer le fichier
      await fs.unlink(filepath);

      res.status(200).json({ message: 'File deleted successfully' });
      return;
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ message: 'Error deleting file' });
      return;
    }
  }
}

export const uploadController = new UploadController();
