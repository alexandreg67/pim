import { RequestHandler, Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../config/multer.config';
import { verifyMagic } from '../middlewares/verifyMagic.middleware';

const router = Router();

router.post(
  '/:type?',
  authMiddleware,
  upload.single('file'),
  verifyMagic,
  uploadController.uploadImage as RequestHandler
);

router.delete('/:type/:filename', authMiddleware, uploadController.deleteImage);

export { router as uploadRoutes };
