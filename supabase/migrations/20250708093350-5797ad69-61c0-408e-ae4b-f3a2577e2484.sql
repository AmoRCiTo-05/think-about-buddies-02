
-- Create storage bucket for thought images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'thought-images',
  'thought-images', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Create RLS policies for the thought-images bucket
CREATE POLICY "Users can upload their own images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'thought-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'thought-images');

CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'thought-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'thought-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add image_urls column to thoughts table
ALTER TABLE public.thoughts 
ADD COLUMN image_urls TEXT[] DEFAULT '{}';

-- Add images column to store image metadata
ALTER TABLE public.thoughts 
ADD COLUMN images JSONB DEFAULT '[]';
