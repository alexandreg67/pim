import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth.middleware';
import { promises as fs } from 'fs';

const signatures: Record<string, number[]> = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/gif': [0x47, 0x49, 0x46, 0x38],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
};

export async function verifyMagic(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
    const buf = await fs.readFile(req.file.path);
    const header = Array.from(buf.slice(0, 4));
    const ok = Object.entries(signatures).some(([mime, sig]) => {
      if (req.file?.mimetype !== mime) return false;
      return sig.every((b, i) => header[i] === b);
    });
    if (!ok) {
      res.status(400).json({ message: 'Invalid file signature' });
      return;
    }
    next();
  } catch {
    res.status(400).json({ message: 'Invalid file' });
  }
}
