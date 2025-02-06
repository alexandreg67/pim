import { Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { AuthRequest } from '../middlewares/auth.middleware';

interface UploadResponse {
  url: string;
  filename: string;
}

class UploadController {
  async uploadImage(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const file = req.file;
      const uploadType = req.params.type || 'images';
      const outputPath = `/storage/assets/${uploadType}`;

      // Redimensionner et optimiser l'image
      await sharp(file.path)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toFile(path.join(outputPath, `optimized-${file.filename}`));

      // Supprimer le fichier original
      await fs.unlink(file.path);

      const response: UploadResponse = {
        url: `/${uploadType}/optimized-${file.filename}`,
        filename: `optimized-${file.filename}`,
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Error processing upload' });
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
