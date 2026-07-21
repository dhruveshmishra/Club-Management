import Redis, { RedisOptions } from 'ioredis';
export { Queue, Worker, QueueEvents } from 'bullmq';

export const getRedisConnection = (url: string): Redis => {
  if (!url) {
    throw new Error('Redis connection URL is required');
  }
  
  // For Upstash TLS compatibility over standard redis protocol (rediss://)
  const options: RedisOptions = {
    maxRetriesPerRequest: null, // BullMQ requirement
  };

  return new Redis(url, options);
};

// Caching helper functions
export const getCachedData = async <T>(
  redis: Redis,
  key: string
): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Cache read error for key ${key}:`, error);
    return null;
  }
};

export const setCachedData = async <T>(
  redis: Redis,
  key: string,
  data: T,
  ttlSeconds: number = 30
): Promise<void> => {
  try {
    const value = JSON.stringify(data);
    await redis.set(key, value, 'EX', ttlSeconds);
  } catch (error) {
    console.error(`Cache write error for key ${key}:`, error);
  }
};

export const invalidateCache = async (
  redis: Redis,
  patternOrKey: string
): Promise<void> => {
  try {
    if (patternOrKey.includes('*')) {
      const keys = await redis.keys(patternOrKey);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } else {
      await redis.del(patternOrKey);
    }
  } catch (error) {
    console.error(`Cache invalidation error for key/pattern ${patternOrKey}:`, error);
  }
};
