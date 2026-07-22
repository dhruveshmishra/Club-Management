'use server';

import { createServerSideClient, createServiceClient } from '../../lib/supabase';
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

  let finalPath = path;

  if (error) {
    if (error.message.includes('Bucket not found') || error.message.includes('not found')) {
      // Try to create the bucket automatically since we have the service key
      await supabase.storage.createBucket(bucket, { public: true });
      
      // Retry the upload
      const retry = await supabase.storage.from(bucket).upload(path, buffer, {
        contentType: file.type,
        upsert: true,
      });

      if (retry.error) {
        throw new Error(`Failed to upload file after creating bucket: ${retry.error.message}`);
      }
      
      finalPath = retry.data?.path || path;
    } else {
      console.error('Storage upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  } else if (data) {
    finalPath = data.path;
  }

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(finalPath);
  return publicUrl;
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    redirect('/login?error=Email+and+password+are+required');
  }

  const supabase = await createServerSideClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    const msg = encodeURIComponent(authError?.message || 'Invalid credentials');
    redirect(`/login?error=${msg}`);
  }

  const user = authData.user;

  const serviceClient = createServiceClient();

  // Retrieve user profile using service client to bypass RLS recursion
  const { data: profile, error: profileError } = await serviceClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    redirect('/login?error=User+profile+not+found.');
  }

  if (profile.role === 'admin') {
    // Reject admins on the web portal
    await supabase.auth.signOut();
    redirect('/login?error=Admin+users+must+log+in+to+the+admin+console.');
  }

  if (profile.role === 'coordinator') {
    // Check approval status using service client
    const { data: coord, error: coordError } = await serviceClient
      .from('coordinator_profiles')
      .select('status')
      .eq('user_id', user.id)
      .single();

    if (coordError || !coord) {
      await supabase.auth.signOut();
      redirect('/login?error=Coordinator+profile+not+found.');
    }

    if (coord.status === 'pending') {
      await supabase.auth.signOut();
      redirect('/login?message=pending_approval');
    }

    if (coord.status === 'rejected') {
      await supabase.auth.signOut();
      redirect('/login?error=Your+coordinator+application+has+been+rejected.');
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
    redirect('/signup/student?error=All+fields+are+required.');
  }

  const year = parseInt(yearStr, 10);
  if (isNaN(year)) {
    redirect('/signup/student?error=Invalid+year+format.');
  }

  const serviceClient = createServiceClient();

  // Create auth user bypassing rate limits
  const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    const msg = encodeURIComponent(authError?.message || 'Failed to register account.');
    redirect(`/signup/student?error=${msg}`);
  }

  const user = authData.user;

  // Insert profile using service client to bypass RLS issues
  const { error: profileError } = await serviceClient
    .from('profiles')
    .insert({
      id: user.id,
      email,
      role: 'student',
    });

  if (profileError) {
    console.error('Profile creation error:', profileError);
    redirect('/signup/student?error=Failed+to+create+student+profile+structure.');
  }

  // Insert student profile
  const { error: studentError } = await serviceClient
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
    redirect('/signup/student?error=Failed+to+complete+student+profile+setup.');
  }

  // Sign out is no longer needed since admin.createUser does not log the user in
  redirect('/login?message=Signup+successful.+Please+log+in.');
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
    redirect('/signup/coordinator?error=All+fields%2C+including+file+uploads%2C+are+required.');
  }

  const serviceClient = createServiceClient();

  // Create Auth User bypassing rate limits
  const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    const msg = encodeURIComponent(authError?.message || 'Failed to register coordinator account.');
    redirect(`/signup/coordinator?error=${msg}`);
  }

  const user = authData.user;

  try {
    // Upload files
    // Use bucket names 'coordinator-uploads' or similar. We will store it under 'coordinator-uploads' bucket
    const photoUrl = await uploadFile(serviceClient, 'coordinator-uploads', `photos/${user.id}_${Date.now()}_${photoFile.name}`, photoFile);
    const proofUrl = await uploadFile(serviceClient, 'coordinator-uploads', `proofs/${user.id}_${Date.now()}_${proofFile.name}`, proofFile);

    // Create profile
    const { error: profileError } = await serviceClient
      .from('profiles')
      .insert({
        id: user.id,
        email,
        role: 'coordinator',
      });

    if (profileError) throw profileError;

    // Create coordinator profile (status defaults to pending)
    const { error: coordError } = await serviceClient
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
    const msg = encodeURIComponent(err.message || 'An error occurred during coordinator signup.');
    redirect(`/signup/coordinator?error=${msg}`);
  }

  redirect('/?message=Signup+request+submitted+successfully.+You+will+be+able+to+log+in+once+an+administrator+approves+your+account.');
}

export async function logoutAction() {
  const supabase = await createServerSideClient();
  await supabase.auth.signOut();
  redirect('/login');
}
