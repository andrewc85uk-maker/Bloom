-- Run this in your Supabase SQL editor to set up the V1 schema.

-- Brand Kit (one per user)
create table if not exists brand_kits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  logo_url text,
  h1_font text,
  h1_size integer,
  h1_colour text,
  h2_font text,
  h2_size integer,
  h2_colour text,
  h3_font text,
  h3_size integer,
  h3_colour text,
  primary_colour text,
  secondary_colour text,
  accent_colour text,
  overlay_colour text,
  overlay_opacity integer default 50,
  text_position text default 'bottom-left',
  handle text,
  logo_position text default 'top-left',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Content Bank
create table if not exists images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  file_url text not null,
  tags text[] default '{}',
  uploaded_at timestamptz default now()
);

-- Posts
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Slides (belong to posts)
create table if not exists slides (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade not null,
  position integer not null,
  slide_type text not null, -- 'hero' | 'text-only' | 'image-only' | 'cta'
  image_id uuid references images(id),
  h1_text text,
  h2_text text,
  body_text text,
  overlay_opacity integer,
  text_position text,
  show_handle boolean default true,
  show_swipe_arrow boolean default true,
  created_at timestamptz default now()
);

-- Row-level security
alter table brand_kits enable row level security;
alter table images enable row level security;
alter table posts enable row level security;
alter table slides enable row level security;

create policy "Users manage their own brand kit" on brand_kits
  for all using (auth.uid() = user_id);

create policy "Users manage their own images" on images
  for all using (auth.uid() = user_id);

create policy "Users manage their own posts" on posts
  for all using (auth.uid() = user_id);

create policy "Users manage their own slides" on slides
  for all using (
    exists (select 1 from posts where posts.id = slides.post_id and posts.user_id = auth.uid())
  );

-- Storage buckets (run separately in Supabase dashboard or via CLI)
-- Bucket: "logos"   -- for brand kit logo uploads
-- Bucket: "images"  -- for content bank photo uploads
