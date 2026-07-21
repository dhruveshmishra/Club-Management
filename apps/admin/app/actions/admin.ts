'use server';

import { createAdminServiceClient, createServerSideClient } from '../../lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Helper to log admin audits
async function logAdminAction(
  supabase: any,
  adminId: string,
  action: string,
  table: string,
  targetId: string,
  details: any
) {
  await supabase.from('admin_audit_log').insert({
    admin_id: adminId,
    action,
    target_table: table,
    target_id: targetId,
    details,
  });
}

// Admin login action
export async function adminLoginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  // Create standard client for auth check
  const supabase = await createServerSideClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: authError?.message || 'Invalid credentials' };
  }

  const user = authData.user;

  // Use privileged service role client to inspect the user's role
  const adminClient = createAdminServiceClient();
  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    // Destroy session if not admin
    await supabase.auth.signOut();
    return { error: 'Access denied: User is not an administrator.' };
  }

  redirect('/');
}

// Admin logout action
export async function adminLogoutAction() {
  const supabase = await createServerSideClient();
  await supabase.auth.signOut();
  redirect('/login');
}

// Coordinator approvals
export async function approveCoordinatorAction(coordUserId: string) {
  const supabase = await createServerSideClient();
  const { data: { user: admin } } = await supabase.auth.getUser();
  if (!admin) return { error: 'Unauthorized' };

  const adminClient = createAdminServiceClient();

  try {
    const { error } = await adminClient
      .from('coordinator_profiles')
      .update({ status: 'approved' })
      .eq('user_id', coordUserId);

    if (error) throw error;

    await logAdminAction(adminClient, admin.id, 'APPROVE_COORDINATOR', 'coordinator_profiles', coordUserId, { status: 'approved' });
    
    revalidatePath('/coordinators');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function rejectCoordinatorAction(coordUserId: string) {
  const supabase = await createServerSideClient();
  const { data: { user: admin } } = await supabase.auth.getUser();
  if (!admin) return { error: 'Unauthorized' };

  const adminClient = createAdminServiceClient();

  try {
    const { error } = await adminClient
      .from('coordinator_profiles')
      .update({ status: 'rejected' })
      .eq('user_id', coordUserId);

    if (error) throw error;

    await logAdminAction(adminClient, admin.id, 'REJECT_COORDINATOR', 'coordinator_profiles', coordUserId, { status: 'rejected' });
    
    revalidatePath('/coordinators');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// User Profile Management
export async function updateUserProfileAction(userId: string, updates: any) {
  const supabase = await createServerSideClient();
  const { data: { user: admin } } = await supabase.auth.getUser();
  if (!admin) return { error: 'Unauthorized' };

  const adminClient = createAdminServiceClient();

  try {
    // 1. Update general profiles role
    if (updates.role) {
      const { error } = await adminClient
        .from('profiles')
        .update({ role: updates.role })
        .eq('id', userId);
      if (error) throw error;
    }

    // 2. If student, update student_profiles
    if (updates.type === 'student') {
      const { error } = await adminClient
        .from('student_profiles')
        .update({
          name: updates.name,
          college: updates.college,
          year: parseInt(updates.year, 10),
          phone: updates.phone,
        })
        .eq('user_id', userId);
      if (error) throw error;
    }

    // 3. If coordinator, update coordinator_profiles
    if (updates.type === 'coordinator') {
      const { error } = await adminClient
        .from('coordinator_profiles')
        .update({
          name: updates.name,
          college: updates.college,
          phone: updates.phone,
          club_id: updates.club_id,
          occupation: updates.occupation,
          status: updates.status,
        })
        .eq('user_id', userId);
      if (error) throw error;
    }

    await logAdminAction(adminClient, admin.id, 'UPDATE_USER_PROFILE', 'profiles', userId, updates);

    revalidatePath('/users');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteUserAction(userId: string) {
  const supabase = await createServerSideClient();
  const { data: { user: admin } } = await supabase.auth.getUser();
  if (!admin) return { error: 'Unauthorized' };

  const adminClient = createAdminServiceClient();

  try {
    // Delete from auth.users (bypasses RLS)
    const { error: authError } = await adminClient.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    // Profiles trigger/cascade will delete database rows
    await logAdminAction(adminClient, admin.id, 'DELETE_USER', 'profiles', userId, { deleted: true });

    revalidatePath('/users');
    revalidatePath('/coordinators');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Club Management
export async function createClubAction(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const logoUrl = formData.get('logoUrl') as string;
  const eligibility = formData.get('eligibilityCriteria') as string;

  if (!name || !description || !logoUrl || !eligibility) {
    return { error: 'All fields are required' };
  }

  const supabase = await createServerSideClient();
  const { data: { user: admin } } = await supabase.auth.getUser();
  if (!admin) return { error: 'Unauthorized' };

  const adminClient = createAdminServiceClient();

  try {
    const { data: club, error } = await adminClient
      .from('clubs')
      .insert({
        name,
        description,
        logo_url: logoUrl,
        eligibility_criteria: eligibility,
      })
      .select()
      .single();

    if (error) throw error;

    await logAdminAction(adminClient, admin.id, 'CREATE_CLUB', 'clubs', club.id, club);

    revalidatePath('/clubs');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateClubAction(clubId: string, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const logoUrl = formData.get('logoUrl') as string;
  const eligibility = formData.get('eligibilityCriteria') as string;

  const supabase = await createServerSideClient();
  const { data: { user: admin } } = await supabase.auth.getUser();
  if (!admin) return { error: 'Unauthorized' };

  const adminClient = createAdminServiceClient();

  try {
    const { error } = await adminClient
      .from('clubs')
      .update({
        name,
        description,
        logo_url: logoUrl,
        eligibility_criteria: eligibility,
      })
      .eq('id', clubId);

    if (error) throw error;

    await logAdminAction(adminClient, admin.id, 'UPDATE_CLUB', 'clubs', clubId, { name, description, logoUrl, eligibility });

    revalidatePath('/clubs');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteClubAction(clubId: string) {
  const supabase = await createServerSideClient();
  const { data: { user: admin } } = await supabase.auth.getUser();
  if (!admin) return { error: 'Unauthorized' };

  const adminClient = createAdminServiceClient();

  try {
    const { error } = await adminClient
      .from('clubs')
      .delete()
      .eq('id', clubId);

    if (error) throw error;

    await logAdminAction(adminClient, admin.id, 'DELETE_CLUB', 'clubs', clubId, { deleted: true });

    revalidatePath('/clubs');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Event Oversight
export async function moderateEventAction(eventId: string, updates: any) {
  const supabase = await createServerSideClient();
  const { data: { user: admin } } = await supabase.auth.getUser();
  if (!admin) return { error: 'Unauthorized' };

  const adminClient = createAdminServiceClient();

  try {
    const { error } = await adminClient
      .from('events')
      .update({
        title: updates.title,
        description: updates.description,
        prize_pool: parseFloat(updates.prizePool || '0'),
        team_size: parseInt(updates.teamSize || '1', 10),
        mode: updates.mode,
        status: updates.status,
        start_date: updates.startDate,
        end_date: updates.endDate,
        registration_deadline: updates.registrationDeadline,
        highlights_text: updates.highlightsText || null,
      })
      .eq('id', eventId);

    if (error) throw error;

    await logAdminAction(adminClient, admin.id, 'MODERATE_EVENT', 'events', eventId, updates);

    revalidatePath('/events');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteEventAction(eventId: string) {
  const supabase = await createServerSideClient();
  const { data: { user: admin } } = await supabase.auth.getUser();
  if (!admin) return { error: 'Unauthorized' };

  const adminClient = createAdminServiceClient();

  try {
    const { error } = await adminClient
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;

    await logAdminAction(adminClient, admin.id, 'DELETE_EVENT', 'events', eventId, { deleted: true });

    revalidatePath('/events');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Registration oversight
export async function deleteRegistrationAction(regId: string) {
  const supabase = await createServerSideClient();
  const { data: { user: admin } } = await supabase.auth.getUser();
  if (!admin) return { error: 'Unauthorized' };

  const adminClient = createAdminServiceClient();

  try {
    const { error } = await adminClient
      .from('registrations')
      .delete()
      .eq('id', regId);

    if (error) throw error;

    await logAdminAction(adminClient, admin.id, 'DELETE_REGISTRATION', 'registrations', regId, { deleted: true });

    revalidatePath('/registrations');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Financial oversight
export async function updateTransactionAction(txId: string, updates: any) {
  const supabase = await createServerSideClient();
  const { data: { user: admin } } = await supabase.auth.getUser();
  if (!admin) return { error: 'Unauthorized' };

  const adminClient = createAdminServiceClient();

  try {
    const { error } = await adminClient
      .from('transactions')
      .update({
        amount: parseFloat(updates.amount),
        type: updates.type,
        description: updates.description,
        date: updates.date,
      })
      .eq('id', txId);

    if (error) throw error;

    await logAdminAction(adminClient, admin.id, 'UPDATE_TRANSACTION', 'transactions', txId, updates);

    revalidatePath('/transactions');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteTransactionAction(txId: string) {
  const supabase = await createServerSideClient();
  const { data: { user: admin } } = await supabase.auth.getUser();
  if (!admin) return { error: 'Unauthorized' };

  const adminClient = createAdminServiceClient();

  try {
    const { error } = await adminClient
      .from('transactions')
      .delete()
      .eq('id', txId);

    if (error) throw error;

    await logAdminAction(adminClient, admin.id, 'DELETE_TRANSACTION', 'transactions', txId, { deleted: true });

    revalidatePath('/transactions');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
