'use server';

import { createServerSideClient, createServiceClient } from '../../lib/supabase';
import { revalidatePath } from 'next/cache';

export async function updateStudentProfileAction(formData: FormData) {
  const name = formData.get('name') as string;
  const college = formData.get('college') as string;
  const year = parseInt(formData.get('year') as string, 10);
  const phone = formData.get('phone') as string;

  if (!name || !college || isNaN(year) || !phone) {
    return { error: 'All fields are required and year must be a valid number.' };
  }

  const supabase = await createServerSideClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const serviceClient = createServiceClient();
    const { error } = await serviceClient
      .from('student_profiles')
      .update({ name, college, year, phone })
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/student');
    return { success: true };
  } catch (err: any) {
    console.error('Update student profile error:', err);
    return { error: err.message || 'Failed to update profile.' };
  }
}

export async function updateCoordinatorProfileAction(formData: FormData) {
  const name = formData.get('name') as string;
  const college = formData.get('college') as string;
  const phone = formData.get('phone') as string;
  const photoUrl = formData.get('photoUrl') as string;

  if (!name || !college || !phone || !photoUrl) {
    return { error: 'All fields are required.' };
  }

  const supabase = await createServerSideClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const serviceClient = createServiceClient();
    const { error } = await serviceClient
      .from('coordinator_profiles')
      .update({ name, college, phone, photo_url: photoUrl })
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/coordinator');
    return { success: true };
  } catch (err: any) {
    console.error('Update coordinator profile error:', err);
    return { error: err.message || 'Failed to update profile.' };
  }
}
