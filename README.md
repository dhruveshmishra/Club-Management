# ClubPulse — Club Management System

ClubPulse is a high-performance club and event management platform designed for universities. It consists of a student/coordinator web portal and an asynchronous background worker for processing event registrations.

## Tech Stack
* **Monorepo Manager**: [Turborepo](https://turbo.build/)
* **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
* **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS + Storage)
* **Background Queue**: [BullMQ](https://bullmq.io/) with [Redis (Upstash)](https://upstash.com/)

---

## Getting Started (Local Development)

Follow these steps to run the project locally after forking:

### 1. Clone your Fork
```bash
git clone https://github.com/YOUR_USERNAME/Club-Management.git
cd Club-Management
```

### 2. Install Dependencies
Install all package and workspace dependencies from the root directory:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
touch .env
```

Add your configuration keys into the `.env` file:
```env
# --- SUPABASE CONFIGURATION ---
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_URL=your_supabase_project_url # Worker compatibility alias

# --- REDIS CONFIGURATION (Upstash) ---
REDIS_URL=your_redis_url
```

### 4. Run the Development Server
Start all applications (`web` and the background `worker`) simultaneously using:
```bash
npm run dev
```

### 5. Access the Application
Once started, you can access the portal at:
* **Web Portal (Students & Coordinators)**: [http://localhost:3000](http://localhost:3000)

---

## Project Structure
* `/apps/web`: The Next.js web application for students and coordinators.
* `/apps/worker`: Node.js daemon worker for queueing database writes.
* `/packages/supabase`: Shared Supabase client configuration.
* `/packages/redis`: Shared Redis connection setup.
* `/packages/ui`: Shared UI component library.
