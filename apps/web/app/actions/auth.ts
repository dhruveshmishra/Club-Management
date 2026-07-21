'use server';

import { createServerSideClient } from '../../lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

// Helper to upload files to Supabase Storage
async function uploadFile(supabase: any, bucket: string, path: string, file: File): Promise<string> {
  // Validate size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File ${file.name} exceeds the 5MB size limit.`);
  }

  // Validate type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed. Only JPEG, PNG, WEBP, and PDF are supported.`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    console.error('Storage upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicUrl;
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createServerSideClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: authError?.message || 'Invalid credentials' };
  }

  const user = authData.user;

  // Retrieve user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return { error: 'User profile not found.' };
  }

  if (profile.role === 'admin') {
    // Reject admins on the web portal
    await supabase.auth.signOut();
    return { error: 'Admin users must log in to the admin console.' };
  }

  if (profile.role === 'coordinator') {
    // Check approval status
    const { data: coord, error: coordError } = await supabase
      .from('coordinator_profiles')
      .select('status')
      .eq('user_id', user.id)
      .single();

    if (coordError || !coord) {
      await supabase.auth.signOut();
      return { error: 'Coordinator profile not found.' };
    }

    if (coord.status === 'pending') {
      await supabase.auth.signOut();
      return { error: 'pending_approval' };
    }

    if (coord.status === 'rejected') {
      await supabase.auth.signOut();
      return { error: 'Your coordinator application has been rejected.' };
    }

    redirect('/coordinator');
  }

  if (profile.role === 'student') {
    redirect('/student');
  }

  return { success: true };
}

export async function studentSignupAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const college = formData.get('college') as string;
  const yearStr = formData.get('year') as string;
  const phone = formData.get('phone') as string;

  if (!email || !password || !name || !college || !yearStr || !phone) {
    return { error: 'All fields are required.' };
  }

  const year = parseInt(yearStr, 10);
  if (isNaN(year)) {
    return { error: 'Invalid year format.' };
  }

  const supabase = await createServerSideClient();

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: authError?.message || 'Failed to register account.' };
  }

  const user = authData.user;

  // Insert profile (public.profiles RLS allows inserting when auth.uid() = id)
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email,
      role: 'student',
    });

  if (profileError) {
    console.error('Profile creation error:', profileError);
    return { error: 'Failed to create student profile structure.' };
  }

  // Insert student profile
  const { error: studentError } = await supabase
    .from('student_profiles')
    .insert({
      user_id: user.id,
      name,
      college,
      year,
      phone,
    });

  if (studentError) {
    console.error('Student profile creation error:', studentError);
    return { error: 'Failed to complete student profile setup.' };
  }

  // Automatic login by redirection to student portal
  redirect('/student');
}

export async function coordinatorSignupAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const college = formData.get('college') as string;
  const phone = formData.get('phone') as string;
  const clubId = formData.get('clubId') as string;
  const occupation = formData.get('occupation') as any;
  
  const photoFile = formData.get('photo') as File;
  const proofFile = formData.get('proof') as File;

  if (!email || !password || !name || !college || !phone || !clubId || !occupation || !photoFile || !proofFile) {
    return { error: 'All fields, including file uploads, are required.' };
  }

  const supabase = await createServerSideClient();

  // Create Auth User
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: authError?.message || 'Failed to register coordinator account.' };
  }

  const user = authData.user;

  try {
    // Upload files
    // Use bucket names 'coordinator-uploads' or similar. We will store it under 'coordinator-uploads' bucket
    const photoUrl = await uploadFile(supabase, 'coordinator-uploads', `photos/${user.id}_${Date.now()}_${photoFile.name}`, photoFile);
    const proofUrl = await uploadFile(supabase, 'coordinator-uploads', `proofs/${user.id}_${Date.now()}_${proofFile.name}`, proofFile);

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email,
        role: 'coordinator',
      });

    if (profileError) throw profileError;

    // Create coordinator profile (status defaults to pending)
    const { error: coordError } = await supabase
      .from('coordinator_profiles')
      .insert({
        user_id: user.id,
        name,
        college,
        phone,
        photo_url: photoUrl,
        club_id: clubId,
        occupation,
        proof_of_occupation_url: proofUrl,
        status: 'pending',
      });

    if (coordError) throw coordError;

  } catch (err: any) {
    console.error('Coordinator signup failed:', err);
    return { error: err.message || 'An error occurred during coordinator signup.' };
  }

  return { success: true, message: 'Signup request submitted successfully. You will be able to log in once an administrator approves your account.' };
}

export async function logoutAction() {
  const supabase = await createServerSideClient();
  await supabase.auth.signOut();
  redirect('/login');
}
