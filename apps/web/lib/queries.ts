import { createServerSideClient } from './supabase';
import { getRedisClient, getCachedData, setCachedData } from './redis';

const CACHE_TTL = 45; // 45 seconds cache TTL

export async function getCachedClubs() {
  try {
    const redis = getRedisClient();
    const cacheKey = 'clubs:list';
    
    const cached = await getCachedData<any[]>(redis, cacheKey);
    if (cached) {
      console.log('Cache HIT for clubs:list');
      return cached;
    }

    console.log('Cache MISS for clubs:list, fetching from Supabase...');
    const supabase = await createServerSideClient();
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    if (data) {
      await setCachedData(redis, cacheKey, data, CACHE_TTL);
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching clubs:', error);
    // Fallback to database directly if Redis is offline
    try {
      const supabase = await createServerSideClient();
      const { data } = await supabase.from('clubs').select('*').order('name');
      return data || [];
    } catch {
      return [];
    }
  }
}

export async function getCachedEvents(clubId?: string) {
  try {
    const redis = getRedisClient();
    const cacheKey = clubId ? `events:list:${clubId}` : 'events:list:all';

    const cached = await getCachedData<any[]>(redis, cacheKey);
    if (cached) {
      console.log(`Cache HIT for ${cacheKey}`);
      return cached;
    }

    console.log(`Cache MISS for ${cacheKey}, fetching from Supabase...`);
    const supabase = await createServerSideClient();
    
    let query = supabase
      .from('events')
      .select('*, clubs(name, logo_url)')
      .order('start_date', { ascending: true });

    if (clubId) {
      query = query.eq('club_id', clubId);
    }

    const { data, error } = await query;
    if (error) throw error;

    if (data) {
      await setCachedData(redis, cacheKey, data, CACHE_TTL);
    }
    return data || [];
  } catch (error) {
    console.error(`Error fetching events for club ${clubId || 'all'}:`, error);
    try {
      const supabase = await createServerSideClient();
      let query = supabase.from('events').select('*, clubs(name, logo_url)').order('start_date');
      if (clubId) query = query.eq('club_id', clubId);
      const { data } = await query;
      return data || [];
    } catch {
      return [];
    }
  }
}
