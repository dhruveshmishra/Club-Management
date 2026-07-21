import { getRedisConnection, Queue } from '@repo/redis';
export * from '@repo/redis';

const REDIS_URL = process.env.REDIS_URL || '';

// Lazy initialization of Redis client and queue to avoid connection errors during Next.js build
let redisInstance: ReturnType<typeof getRedisConnection> | null = null;
let registrationQueue: Queue | null = null;

export const getRedisClient = () => {
  if (!REDIS_URL) {
    throw new Error('REDIS_URL environment variable is missing');
  }
  if (!redisInstance) {
    redisInstance = getRedisConnection(REDIS_URL);
  }
  return redisInstance;
};

export const getRegistrationQueue = () => {
  if (!registrationQueue) {
    registrationQueue = new Queue('registrations-queue', {
      connection: getRedisClient(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
      },
    });
  }
  return registrationQueue;
};
