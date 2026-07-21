import { getRedisConnection, Worker } from '@repo/redis';
import { createServiceClient } from '@repo/supabase';
import * as dotenv from 'dotenv';
// Load env vars
dotenv.config();
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const REDIS_URL = process.env.REDIS_URL || '';
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('CRITICAL: Supabase credentials missing in background worker');
    process.exit(1);
}
if (!REDIS_URL) {
    console.error('CRITICAL: REDIS_URL missing in background worker');
    process.exit(1);
}
console.log('Worker starting...');
console.log(`Connecting to Redis: ${REDIS_URL.split('@')[1] || REDIS_URL}`);
const redisConnection = getRedisConnection(REDIS_URL);
const supabase = createServiceClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const worker = new Worker('registrations-queue', async (job) => {
    const { eventId, studentUserId } = job.data;
    console.log(`[Job ${job.id}] Processing registration: student ${studentUserId} for event ${eventId}`);
    if (!eventId || !studentUserId) {
        throw new Error('Invalid job data: eventId and studentUserId are required');
    }
    // Insert registration row into Supabase using service role client
    const { data, error } = await supabase
        .from('registrations')
        .insert({
        event_id: eventId,
        student_user_id: studentUserId,
    })
        .select()
        .single();
    if (error) {
        // Check if it's a unique constraint error (meaning already registered)
        if (error.code === '23505') {
            console.warn(`[Job ${job.id}] Student ${studentUserId} is already registered for event ${eventId}`);
            return { success: true, message: 'Already registered', registration: null };
        }
        console.error(`[Job ${job.id}] Failed to insert registration:`, error);
        throw new Error(`Supabase error: ${error.message}`);
    }
    console.log(`[Job ${job.id}] Successfully registered student ${studentUserId} for event ${eventId}. ID: ${data.id}`);
    return { success: true, registrationId: data.id };
}, {
    connection: redisConnection,
    concurrency: 5, // Limit concurrent inserts to protect database
});
worker.on('active', (job) => {
    console.log(`Job ${job.id} active`);
});
worker.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed. Result:`, result);
});
worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error:`, err.message);
});
// Handle graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`Received ${signal}. Shutting down worker...`);
    await worker.close();
    redisConnection.disconnect();
    console.log('Worker shut down successfully.');
    process.exit(0);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
