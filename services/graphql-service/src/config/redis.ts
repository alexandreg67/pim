import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Configuration Redis
const redisConfig = {
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  // 1 heure par défaut pour TTL
  defaultTTL: parseInt(process.env.REDIS_DEFAULT_TTL || '3600'),
};

// Client Redis
export const redisClient = new Redis({
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.password || undefined,
  db: redisConfig.db,
});

// Log des connexions/déconnexions Redis
redisClient.on('connect', () => {
  console.info('🔄 Redis connection established');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

// Service de cache Redis
export class RedisCache {
  // Obtenir une valeur du cache
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error fetching ${key} from Redis:`, error);
      return null;
    }
  }

  // Définir une valeur dans le cache
  static async set(key: string, value: unknown, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await redisClient.set(key, serializedValue, 'EX', ttl);
      } else {
        await redisClient.set(
          key,
          serializedValue,
          'EX',
          redisConfig.defaultTTL
        );
      }
    } catch (error) {
      console.error(`Error setting ${key} in Redis:`, error);
    }
  }

  // Supprimer une valeur du cache
  static async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error(`Error deleting ${key} from Redis:`, error);
    }
  }

  // Invalider les clés par pattern
  static async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
        console.info(
          `Invalidated ${keys.length} cache entries for pattern ${pattern}`
        );
      }
    } catch (error) {
      console.error(`Error invalidating pattern ${pattern} in Redis:`, error);
    }
  }

  // Vérifier si une clé existe
  static async exists(key: string): Promise<boolean> {
    try {
      return (await redisClient.exists(key)) === 1;
    } catch (error) {
      console.error(`Error checking if ${key} exists in Redis:`, error);
      return false;
    }
  }
}

export default RedisCache;
