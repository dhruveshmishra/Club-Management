'use server';

import { createServerSideClient } from '../../lib/supabase';
import { getRedisClient, invalidateCache } from '../../lib/redis';
import { revalidatePath } from 'next/cache';

// Helper to check if coordinator has management permissions
async function getApprovedCoordinator(supabase: any, userId: string, allowedOccupations?: string[]) {
  const { data: coord, error } = await supabase
    .from('coordinator_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !coord || coord.status !== 'approved') {
    throw new Error('Unauthorized or account not approved');
  }

  if (allowedOccupations && !allowedOccupations.includes(coord.occupation)) {
    throw new Error('Unauthorized: Insufficient privileges for this role');
  }

  return coord;
}

export async function createEventAction(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const prizePool = parseFloat(formData.get('prizePool') as string || '0');
  const teamSize = parseInt(formData.get('teamSize') as string || '1', 10);
  const mode = formData.get('mode') as 'online' | 'offline';
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const regDeadline = formData.get('registrationDeadline') as string;
  const photoUrl = formData.get('photoUrl') as string; // Optional single photo input or preset

  const supabase = await createServerSideClient();

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    // Check permission (president, vice_president, treasurer only)
    const coord = await getApprovedCoordinator(supabase, user.id, ['president', 'vice_president', 'treasurer']);

    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        club_id: coord.club_id,
        title,
        description,
        prize_pool: prizePool,
        team_size: teamSize,
        mode,
        status: 'upcoming',
        start_date: startDate,
        end_date: endDate,
        registration_deadline: regDeadline,
        photo_urls: photoUrl ? [photoUrl] : [],
        created_by: coord.user_id,
      })
      .select()
      .single();

    if (eventError) throw eventError;

    // Invalidate Redis cache
    const redis = getRedisClient();
    await invalidateCache(redis, 'events:list:*');
    await invalidateCache(redis, 'events:list:all');
    revalidatePath('/student');
    revalidatePath('/coordinator');

    return { success: true, event };
  } catch (error: any) {
    console.error('Create event error:', error);
    return { error: error.message || 'Failed to create event.' };
  }
}

export async function updateEventAction(eventId: string, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const prizePool = parseFloat(formData.get('prizePool') as string || '0');
  const teamSize = parseInt(formData.get('teamSize') as string || '1', 10);
  const mode = formData.get('mode') as 'online' | 'offline';
  const status = formData.get('status') as 'upcoming' | 'ongoing' | 'past';
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const regDeadline = formData.get('registrationDeadline') as string;
  const highlightsText = formData.get('highlightsText') as string;

  const supabase = await createServerSideClient();

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const coord = await getApprovedCoordinator(supabase, user.id, ['president', 'vice_president', 'treasurer']);

    const { error: eventError } = await supabase
      .from('events')
      .update({
        title,
        description,
        prize_pool: prizePool,
        team_size: teamSize,
        mode,
        status,
        start_date: startDate,
        end_date: endDate,
        registration_deadline: regDeadline,
        highlights_text: highlightsText || null,
      })
      .eq('id', eventId)
      .eq('club_id', coord.club_id); // Ensure event belongs to their club

    if (eventError) throw eventError;

    // Invalidate Redis cache
    const redis = getRedisClient();
    await invalidateCache(redis, 'events:list:*');
    await invalidateCache(redis, 'events:list:all');
    revalidatePath('/student');
    revalidatePath(`/student/event/${eventId}`);
    revalidatePath('/coordinator');

    return { success: true };
  } catch (error: any) {
    console.error('Update event error:', error);
    return { error: error.message || 'Failed to update event.' };
  }
}

export async function deleteEventAction(eventId: string) {
  const supabase = await createServerSideClient();

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const coord = await getApprovedCoordinator(supabase, user.id, ['president', 'vice_president', 'treasurer']);

    const { error: eventError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)
      .eq('club_id', coord.club_id);

    if (eventError) throw eventError;

    // Invalidate Redis cache
    const redis = getRedisClient();
    await invalidateCache(redis, 'events:list:*');
    await invalidateCache(redis, 'events:list:all');
    revalidatePath('/student');
    revalidatePath('/coordinator');

    return { success: true };
  } catch (error: any) {
    console.error('Delete event error:', error);
    return { error: error.message || 'Failed to delete event.' };
  }
}

export async function createTransactionAction(formData: FormData) {
  const type = formData.get('type') as 'income' | 'expense';
  const amount = parseFloat(formData.get('amount') as string);
  const description = formData.get('description') as string;
  const date = formData.get('date') as string;

  if (isNaN(amount) || amount <= 0 || !description) {
    return { error: 'Invalid transaction inputs.' };
  }

  const supabase = await createServerSideClient();

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    // Only approved coordinators with occupation = treasurer can manage finances
    const coord = await getApprovedCoordinator(supabase, user.id, ['treasurer']);

    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        club_id: coord.club_id,
        type,
        amount,
        description,
        date: date || new Date().toISOString(),
        created_by: coord.user_id,
      });

    if (txError) throw txError;

    revalidatePath('/coordinator/transactions');
    return { success: true };
  } catch (error: any) {
    console.error('Create transaction error:', error);
    return { error: error.message || 'Failed to record transaction.' };
  }
}
