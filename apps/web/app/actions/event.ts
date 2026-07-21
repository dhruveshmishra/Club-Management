'use server';

import { createServerSideClient } from '../../lib/supabase';
import { getRegistrationQueue } from '../../lib/redis';
import { revalidatePath } from 'next/cache';

export async function registerForEventAction(eventId: string) {
  if (!eventId) {
    return { error: 'Event ID is required' };
  }

  const supabase = await createServerSideClient();

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  // Verify the user is a student
  const { data: student } = await supabase
    .from('student_profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .single();

  if (!student) {
    return { error: 'Only student accounts can register for events.' };
  }

  // Check if already registered
  const { data: existingReg } = await supabase
    .from('registrations')
    .select('id')
    .eq('event_id', eventId)
    .eq('student_user_id', user.id)
    .single();

  if (existingReg) {
    return { error: 'You are already registered for this event.' };
  }

  // Check event registration deadline
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('registration_deadline')
    .eq('id', eventId)
    .single();

  if (eventError || !event) {
    return { error: 'Event not found.' };
  }

  if (new Date() > new Date(event.registration_deadline)) {
    return { error: 'The registration deadline for this event has passed.' };
  }

  try {
    const queue = getRegistrationQueue();
    // Add job to BullMQ queue
    await queue.add('register-student', {
      eventId,
      studentUserId: user.id,
    });

    console.log(`[Queue] Added registration job: student ${user.id} for event ${eventId}`);
    revalidatePath(`/student/event/${eventId}`);
    revalidatePath('/student');

    return { success: true, message: 'Your registration request is queued. You will be registered shortly!' };
  } catch (error: any) {
    console.error('Queue error:', error);
    return { error: 'Failed to queue your registration. Please try again.' };
  }
}
