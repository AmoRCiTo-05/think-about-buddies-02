
-- Create thought_interactions table for likes, comments, etc.
CREATE TABLE IF NOT EXISTS public.thought_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thought_id UUID NOT NULL REFERENCES public.thoughts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'comment', 'share')),
  comment_text TEXT, -- Only used for comments
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Prevent duplicate likes/shares from same user
  UNIQUE(thought_id, user_id, interaction_type) 
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_thought_interactions_thought_id ON public.thought_interactions(thought_id);
CREATE INDEX IF NOT EXISTS idx_thought_interactions_user_id ON public.thought_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_thought_interactions_type ON public.thought_interactions(interaction_type);

-- Enable RLS
ALTER TABLE public.thought_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all interactions" ON public.thought_interactions
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own interactions" ON public.thought_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions" ON public.thought_interactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions" ON public.thought_interactions
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to get interaction counts for thoughts
CREATE OR REPLACE FUNCTION get_thought_interaction_counts(thought_ids UUID[])
RETURNS TABLE (
  thought_id UUID,
  likes_count BIGINT,
  comments_count BIGINT,
  shares_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ti.thought_id,
    COUNT(*) FILTER (WHERE ti.interaction_type = 'like') as likes_count,
    COUNT(*) FILTER (WHERE ti.interaction_type = 'comment') as comments_count,
    COUNT(*) FILTER (WHERE ti.interaction_type = 'share') as shares_count
  FROM public.thought_interactions ti
  WHERE ti.thought_id = ANY(thought_ids)
  GROUP BY ti.thought_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user has liked a thought
CREATE OR REPLACE FUNCTION check_user_interaction(p_thought_id UUID, p_user_id UUID, p_interaction_type TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.thought_interactions
    WHERE thought_id = p_thought_id 
    AND user_id = p_user_id 
    AND interaction_type = p_interaction_type
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
