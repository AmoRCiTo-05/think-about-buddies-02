
-- Create user profiles table with unique usernames
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create thoughts table to store user thoughts
CREATE TABLE public.thoughts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'trip', 'person', 'place', 'other'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  privacy TEXT NOT NULL DEFAULT 'private', -- 'private', 'public'
  location TEXT,
  location_verified BOOLEAN DEFAULT false,
  custom_category TEXT, -- for 'other' type thoughts
  tags TEXT[],
  mentioned_users TEXT[], -- array of usernames mentioned
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user mentions table for tracking mentions
CREATE TABLE public.user_mentions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thought_id UUID REFERENCES public.thoughts(id) ON DELETE CASCADE NOT NULL,
  mentioned_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mentioned_username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mentions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for thoughts
CREATE POLICY "Users can view their own thoughts" ON public.thoughts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public thoughts" ON public.thoughts
  FOR SELECT USING (privacy = 'public');

CREATE POLICY "Users can insert their own thoughts" ON public.thoughts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own thoughts" ON public.thoughts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own thoughts" ON public.thoughts
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user mentions
CREATE POLICY "Users can view mentions of their thoughts" ON public.user_mentions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.thoughts 
      WHERE thoughts.id = user_mentions.thought_id 
      AND thoughts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view mentions where they are mentioned" ON public.user_mentions
  FOR SELECT USING (auth.uid() = mentioned_user_id);

CREATE POLICY "Users can insert mentions for their thoughts" ON public.user_mentions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.thoughts 
      WHERE thoughts.id = user_mentions.thought_id 
      AND thoughts.user_id = auth.uid()
    )
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, email, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substring(new.id::text, 1, 8)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER thoughts_updated_at
  BEFORE UPDATE ON public.thoughts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
