import { NextFunction, Request, Response } from 'express';

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
const max = Number(process.env.RATE_LIMIT_MAX ?? 50);

const buckets = new Map<string, { count: number; resetAt: number }>();

const keyFor = (req: Request) => req.ip || req.headers['x-real-ip'] || 'anon';

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const key = String(keyFor(req));
  const now = Date.now();
  const entry = buckets.get(key) ?? { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count += 1;
  buckets.set(key, entry);
  if (entry.count > max) return res.status(429).json({ message: 'Too many requests' });
  next();
}
