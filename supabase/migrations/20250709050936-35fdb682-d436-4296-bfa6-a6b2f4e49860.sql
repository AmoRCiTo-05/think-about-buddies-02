-- Create thought_replies table for replies to thoughts
CREATE TABLE public.thought_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thought_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create thought_likes table for likes on thoughts
CREATE TABLE public.thought_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thought_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(thought_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.thought_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thought_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies for thought_replies
CREATE POLICY "Users can view replies to public thoughts" 
ON public.thought_replies 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.thoughts 
    WHERE id = thought_replies.thought_id 
    AND privacy = 'public'
  )
);

CREATE POLICY "Users can view replies to their own thoughts" 
ON public.thought_replies 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.thoughts 
    WHERE id = thought_replies.thought_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create replies to public thoughts" 
ON public.thought_replies 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.thoughts 
    WHERE id = thought_replies.thought_id 
    AND privacy = 'public'
  )
);

CREATE POLICY "Users can update their own replies" 
ON public.thought_replies 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own replies" 
ON public.thought_replies 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for thought_likes
CREATE POLICY "Users can view all likes" 
ON public.thought_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can like thoughts" 
ON public.thought_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike thoughts" 
ON public.thought_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add foreign key constraints
ALTER TABLE public.thought_replies 
ADD CONSTRAINT fk_thought_replies_thought_id 
FOREIGN KEY (thought_id) REFERENCES public.thoughts(id) ON DELETE CASCADE;

ALTER TABLE public.thought_likes 
ADD CONSTRAINT fk_thought_likes_thought_id 
FOREIGN KEY (thought_id) REFERENCES public.thoughts(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_thought_replies_thought_id ON public.thought_replies(thought_id);
CREATE INDEX idx_thought_replies_user_id ON public.thought_replies(user_id);
CREATE INDEX idx_thought_likes_thought_id ON public.thought_likes(thought_id);
CREATE INDEX idx_thought_likes_user_id ON public.thought_likes(user_id);

-- Add updated_at trigger for thought_replies
CREATE TRIGGER update_thought_replies_updated_at
BEFORE UPDATE ON public.thought_replies
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();