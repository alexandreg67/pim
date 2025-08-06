import { PluginDefinition } from '@apollo/server';

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
const max = Number(process.env.RATE_LIMIT_MAX ?? 200);

const buckets = new Map<string, { count: number; resetAt: number }>();

const keyFor = (ip?: string) => ip || 'anon';

type CtxLike = { req?: { headers?: Record<string, unknown> } } & {
  ipAddress?: string;
};

export const rateLimitPlugin = (): PluginDefinition => ({
  async requestDidStart(requestContext) {
    const ctx = requestContext.contextValue as unknown as CtxLike;
    const hdrIp = ctx.req?.headers?.['x-real-ip'];
    const ip = typeof hdrIp === 'string' ? hdrIp : ctx.ipAddress;
    const key = keyFor(typeof ip === 'string' ? ip : undefined);
    const now = Date.now();
    const entry = buckets.get(key) ?? { count: 0, resetAt: now + windowMs };
    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }
    entry.count += 1;
    buckets.set(key, entry);
    if (entry.count > max) {
      throw new Error('Too many requests');
    }
    return {};
  },
});
