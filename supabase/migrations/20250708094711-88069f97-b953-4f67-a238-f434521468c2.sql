
-- Add followers/following system
CREATE TABLE public.user_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Add bookmarked profiles system
CREATE TABLE public.user_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bookmarked_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, bookmarked_user_id)
);

-- Enable RLS for user_follows
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_follows
CREATE POLICY "Users can view all follows" ON public.user_follows
  FOR SELECT USING (true);

CREATE POLICY "Users can follow others" ON public.user_follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others" ON public.user_follows
  FOR DELETE USING (auth.uid() = follower_id);

-- Enable RLS for user_bookmarks
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_bookmarks
CREATE POLICY "Users can view their own bookmarks" ON public.user_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can bookmark profiles" ON public.user_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove bookmarks" ON public.user_bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Add unique constraint to profiles username (case-insensitive)
CREATE UNIQUE INDEX profiles_username_unique_idx ON public.profiles (LOWER(username));

-- Create function to search users by username or email
CREATE OR REPLACE FUNCTION public.search_users(search_term TEXT)
RETURNS TABLE (
  id UUID,
  username TEXT,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.user_id as id,
    p.username,
    p.full_name,
    p.email,
    p.avatar_url,
    p.bio
  FROM public.profiles p
  WHERE 
    LOWER(p.username) LIKE LOWER('%' || search_term || '%') OR
    LOWER(p.full_name) LIKE LOWER('%' || search_term || '%') OR
    LOWER(p.email) LIKE LOWER('%' || search_term || '%')
  ORDER BY p.username;
END;
$$;

-- Create function to search public thoughts
CREATE OR REPLACE FUNCTION public.search_public_thoughts(search_term TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  type TEXT,
  location TEXT,
  tags TEXT[],
  image_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE,
  username TEXT,
  user_full_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.title,
    t.content,
    t.type,
    t.location,
    t.tags,
    t.image_urls,
    t.created_at,
    p.username,
    p.full_name as user_full_name
  FROM public.thoughts t
  JOIN public.profiles p ON t.user_id = p.user_id
  WHERE 
    t.privacy = 'public' AND
    (
      LOWER(t.title) LIKE LOWER('%' || search_term || '%') OR
      LOWER(t.content) LIKE LOWER('%' || search_term || '%') OR
      LOWER(t.location) LIKE LOWER('%' || search_term || '%') OR
      EXISTS (
        SELECT 1 FROM unnest(t.tags) AS tag 
        WHERE LOWER(tag) LIKE LOWER('%' || search_term || '%')
      )
    )
  ORDER BY t.created_at DESC;
END;
$$;
