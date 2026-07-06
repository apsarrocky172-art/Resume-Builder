-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table (Extends Supabase Auth Auth.users)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  name text not null,
  email text not null unique,
  role text default 'student' check (role in ('student', 'recruiter', 'admin')),
  skills text[] default '{}',
  education jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically create a user profile when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Resumes Table
create table public.resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  template_id text default 'modern',
  personal_info jsonb not null default '{}'::jsonb,
  education jsonb default '[]'::jsonb,
  experience jsonb default '[]'::jsonb,
  projects jsonb default '[]'::jsonb,
  skills text[] default '{}',
  certifications text[] default '{}',
  achievements text[] default '{}',
  resume_score integer default 0,
  ats_feedback jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Interviews Table
create table public.interviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  type text not null check (type in ('hr', 'technical', 'behavioral', 'system-design')),
  role_topic text not null,
  transcript jsonb default '[]'::jsonb,
  scores jsonb default '{"technical": 0, "communication": 0, "confidence": 0, "overall": 0}'::jsonb,
  feedback jsonb default '{}'::jsonb,
  status text default 'in-progress' check (status in ('in-progress', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Jobs Table
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  company text not null,
  location text not null,
  type text not null check (type in ('full-time', 'internship')),
  salary text not null,
  description text not null,
  skills_required text[] not null,
  link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Questions Table
create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  type text not null check (type in ('aptitude', 'coding')),
  category text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  question_text text not null,
  options text[] default '{}',
  correct_option integer,
  code_template text,
  test_cases jsonb default '[]'::jsonb,
  explanation text,
  company_tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Submissions Table
create table public.submissions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  code text not null,
  language text not null,
  status text not null check (status in ('Accepted', 'Wrong Answer', 'Runtime Error', 'Compile Error')),
  score integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
