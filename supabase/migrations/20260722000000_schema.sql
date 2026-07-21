-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('student', 'coordinator', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create student_profiles table
CREATE TABLE IF NOT EXISTS public.student_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    college TEXT NOT NULL,
    year INTEGER NOT NULL,
    phone TEXT NOT NULL
);

-- Create clubs table
CREATE TABLE IF NOT EXISTS public.clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    eligibility_criteria TEXT NOT NULL
);

-- Create coordinator_profiles table
CREATE TABLE IF NOT EXISTS public.coordinator_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    college TEXT NOT NULL,
    phone TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    occupation TEXT NOT NULL CHECK (occupation IN ('president', 'vice_president', 'treasurer', 'member')),
    proof_of_occupation_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    prize_pool NUMERIC NOT NULL DEFAULT 0,
    team_size INTEGER NOT NULL DEFAULT 1,
    mode TEXT NOT NULL CHECK (mode IN ('online', 'offline')),
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'past')),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    registration_deadline TIMESTAMPTZ NOT NULL,
    highlights_text TEXT,
    photo_urls TEXT[] NOT NULL DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES public.coordinator_profiles(user_id) ON DELETE CASCADE
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_user_id UUID NOT NULL REFERENCES public.student_profiles(user_id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (event_id, student_user_id)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount NUMERIC NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES public.coordinator_profiles(user_id) ON DELETE CASCADE
);

-- Create admin_audit_log table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details JSONB NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coordinator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- RLS POLICIES FOR profiles
-- ----------------------------------------------------
CREATE POLICY "Allow users to read their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Allow insert during profile creation"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------
-- RLS POLICIES FOR student_profiles
-- ----------------------------------------------------
CREATE POLICY "Allow students to read their own profile"
    ON public.student_profiles FOR SELECT
    USING (
        auth.uid() = user_id 
        OR EXISTS (
            SELECT 1 FROM public.coordinator_profiles cp 
            WHERE cp.user_id = auth.uid() AND cp.status = 'approved'
        )
    );

CREATE POLICY "Allow students to insert/update their own profile"
    ON public.student_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow students to update their own profile"
    ON public.student_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------
-- RLS POLICIES FOR clubs
-- ----------------------------------------------------
CREATE POLICY "Allow public read access to clubs"
    ON public.clubs FOR SELECT
    USING (true);

-- ----------------------------------------------------
-- RLS POLICIES FOR coordinator_profiles
-- ----------------------------------------------------
CREATE POLICY "Allow coordinators to read own or same-club approved profiles"
    ON public.coordinator_profiles FOR SELECT
    USING (
        auth.uid() = user_id
        OR (
            status = 'approved' 
            AND EXISTS (
                SELECT 1 FROM public.coordinator_profiles cp 
                WHERE cp.user_id = auth.uid() 
                AND cp.club_id = public.coordinator_profiles.club_id 
                AND cp.status = 'approved'
            )
        )
    );

CREATE POLICY "Allow coordinators to insert their own profile"
    ON public.coordinator_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow coordinators to update their own profile"
    ON public.coordinator_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------
-- RLS POLICIES FOR events
-- ----------------------------------------------------
CREATE POLICY "Allow any authenticated or anon user to read events"
    ON public.events FOR SELECT
    USING (true);

CREATE POLICY "Allow coordinators with management role to manage events"
    ON public.events FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.coordinator_profiles cp
            WHERE cp.user_id = auth.uid()
            AND cp.club_id = public.events.club_id
            AND cp.status = 'approved'
            AND cp.occupation IN ('president', 'vice_president', 'treasurer')
        )
    );

-- ----------------------------------------------------
-- RLS POLICIES FOR registrations
-- ----------------------------------------------------
CREATE POLICY "Allow students to read/insert registrations"
    ON public.registrations FOR SELECT
    USING (
        auth.uid() = student_user_id
        OR EXISTS (
            SELECT 1 FROM public.coordinator_profiles cp
            JOIN public.events e ON e.id = public.registrations.event_id
            WHERE cp.user_id = auth.uid()
            AND cp.club_id = e.club_id
            AND cp.status = 'approved'
        )
    );

CREATE POLICY "Allow student insertion of own registration"
    ON public.registrations FOR INSERT
    WITH CHECK (auth.uid() = student_user_id);

-- ----------------------------------------------------
-- RLS POLICIES FOR transactions
-- ----------------------------------------------------
CREATE POLICY "Allow treasurers to select/insert/update transactions"
    ON public.transactions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.coordinator_profiles cp
            WHERE cp.user_id = auth.uid()
            AND cp.club_id = public.transactions.club_id
            AND cp.status = 'approved'
            AND cp.occupation = 'treasurer'
        )
    );

-- ----------------------------------------------------
-- RLS POLICIES FOR admin_audit_log
-- ----------------------------------------------------
-- By default, no public access policies are defined, meaning ONLY the service role can access this table.
