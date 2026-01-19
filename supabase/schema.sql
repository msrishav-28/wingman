-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles (Students)
create table public.students (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  department text,
  year integer,
  semester integer,
  total_xp integer default 0,
  level integer default 1,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Students
alter table public.students enable row level security;
create policy "Users can view their own profile" on public.students for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.students for update using (auth.uid() = id);
create policy "Users can insert their own profile" on public.students for insert with check (auth.uid() = id);


-- 2. Subjects
create table public.subjects (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.students(id) not null,
  name text not null,
  code text,
  credits integer default 3,
  professor text,
  room text,
  color text, -- For UI theming
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Subjects
alter table public.subjects enable row level security;
create policy "Users can view their own subjects" on public.subjects for select using (auth.uid() = student_id);
create policy "Users can insert their own subjects" on public.subjects for insert with check (auth.uid() = student_id);
create policy "Users can update their own subjects" on public.subjects for update using (auth.uid() = student_id);
create policy "Users can delete their own subjects" on public.subjects for delete using (auth.uid() = student_id);


-- 3. Attendance
create table public.attendance (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.students(id) not null,
  subject_id uuid references public.subjects(id) on delete cascade not null,
  status text check (status in ('present', 'absent', 'medical', 'cancelled')) not null,
  date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Attendance
alter table public.attendance enable row level security;
create policy "Users can view their own attendance" on public.attendance for select using (auth.uid() = student_id);
create policy "Users can insert their own attendance" on public.attendance for insert with check (auth.uid() = student_id);
create policy "Users can update their own attendance" on public.attendance for update using (auth.uid() = student_id);
create policy "Users can delete their own attendance" on public.attendance for delete using (auth.uid() = student_id);


-- 4. Grades
create table public.grades (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.students(id) not null,
  subject_id uuid references public.subjects(id) on delete cascade not null,
  exam_type text not null, -- 'mid', 'end', 'assignment', 'quiz'
  marks_obtained numeric not null,
  total_marks numeric not null,
  grade_letter text,
  semester integer,
  exam_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Grades
alter table public.grades enable row level security;
create policy "Users can view their own grades" on public.grades for select using (auth.uid() = student_id);
create policy "Users can insert their own grades" on public.grades for insert with check (auth.uid() = student_id);
create policy "Users can update their own grades" on public.grades for update using (auth.uid() = student_id);
create policy "Users can delete their own grades" on public.grades for delete using (auth.uid() = student_id);


-- 5. Assignments
create table public.assignments (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.students(id) not null,
  subject_id uuid references public.subjects(id) on delete cascade not null,
  title text not null,
  description text,
  due_date timestamp with time zone,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  status text check (status in ('pending', 'completed', 'overdue')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Assignments
alter table public.assignments enable row level security;
create policy "Users can view their own assignments" on public.assignments for select using (auth.uid() = student_id);
create policy "Users can manage their assignments" on public.assignments for all using (auth.uid() = student_id);


-- 6. Achievements (Gamification)
create table public.achievements (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.students(id) not null,
  achievement_id text not null, -- unique identifier key e.g. 'perfect_week'
  title text not null,
  description text,
  icon text,
  rarity text check (rarity in ('common', 'rare', 'epic', 'legendary')),
  xp_earned integer default 0,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Achievements
alter table public.achievements enable row level security;
create policy "Users can view their achievements" on public.achievements for select using (auth.uid() = student_id);
-- Note: Insertions should be handled by server-side functions or edge functions for security, 
-- but allowing insert for now for MVP / client-side gamification logic if needed, or restricted.
create policy "Users can insert achievements (MVP)" on public.achievements for insert with check (auth.uid() = student_id);


-- 7. XP Transactions
create table public.xp_transactions (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.students(id) not null,
  amount integer not null,
  reason text,
  source text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for XP
alter table public.xp_transactions enable row level security;
create policy "Users can view their xp history" on public.xp_transactions for select using (auth.uid() = student_id);
create policy "Users can insert xp (MVP)" on public.xp_transactions for insert with check (auth.uid() = student_id);


-- 8. Streaks
create table public.streaks (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.students(id) not null,
  streak_type text not null, -- 'attendance', 'study', 'login'
  current_streak integer default 0,
  longest_streak integer default 0,
  last_activity_date date,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Streaks
alter table public.streaks enable row level security;
create policy "Users can view their streaks" on public.streaks for select using (auth.uid() = student_id);
create policy "Users can update their streaks" on public.streaks for all using (auth.uid() = student_id);
create policy "Users can insert their streaks" on public.streaks for insert with check (auth.uid() = student_id);


-- 9. AI Messages
create table public.ai_messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id text not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  tokens_used integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for AI Messages
-- Assuming these are user-specific, but the service uses a conversation ID
-- We'll add a user_id column in a real production app, but following existing service logic:
-- For now we will allow authenticated users to insert.
alter table public.ai_messages enable row level security;
create policy "Users can view messages" on public.ai_messages for select to authenticated using (true);
create policy "Users can insert messages" on public.ai_messages for insert to authenticated with check (true);


-- 10. Predictions
create table public.predictions (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.students(id) not null,
  subject_id uuid references public.subjects(id),
  model_version text,
  prediction_type text,
  predicted_value numeric,
  confidence numeric,
  features_used jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Predictions
alter table public.predictions enable row level security;
create policy "Users can view their predictions" on public.predictions for select using (auth.uid() = student_id);
create policy "Users can insert their predictions" on public.predictions for insert with check (auth.uid() = student_id);


-- Helper Functions

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.students (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
