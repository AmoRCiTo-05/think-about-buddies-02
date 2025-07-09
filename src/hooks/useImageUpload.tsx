
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return null;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return null;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to upload images');
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('thought-images')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('thought-images')
        .getPublicUrl(data.path);

      toast.success('Image uploaded successfully');
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (url: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Extract file path from URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user.id}/${fileName}`;

      const { error } = await supabase.storage
        .from('thought-images')
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete image');
        return false;
      }

      toast.success('Image deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading
  };
};
