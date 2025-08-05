import multer from 'multer';
import { Request } from 'express';

const imageStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const uploadType = req.params.type || 'images';
    cb(null, `/storage/assets/${uploadType}`);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const base = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${base}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type. Only JPEG, PNG, GIF and WEBP are allowed.')
    );
  }
};

export const upload = multer({
  storage: imageStorage,
  limits: {
    fileSize: (Number(process.env.MAX_FILE_SIZE_MB || 5)) * 1024 * 1024,
  },
  fileFilter,
});
