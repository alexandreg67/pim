import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../config/multer.config';

const router = Router();

router.post(
  '/:type?',
  authMiddleware,
  upload.single('file'),
  uploadController.uploadImage
);

router.delete('/:type/:filename', authMiddleware, uploadController.deleteImage);

export { router as uploadRoutes };
