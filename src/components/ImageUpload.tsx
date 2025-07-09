
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Image, Upload, X, Loader2 } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  onImageRemove: (url: string) => void;
  images: string[];
  maxImages?: number;
  title?: string;
}

const ImageUpload = ({ 
  onImageUpload, 
  onImageRemove, 
  images, 
  maxImages = 5,
  title = "Add Images"
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading } = useImageUpload();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      if (images.length >= maxImages) break;
      
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const url = await uploadImage(file);
        if (url) {
          onImageUpload(url);
        }
      }
    }

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (url: string) => {
    onImageRemove(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="text-xs text-muted-foreground">
          {images.length}/{maxImages}
        </span>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((url, index) => (
            <Card key={index} className="relative p-2 bg-secondary/50">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                onClick={() => handleRemoveImage(url)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {images.length < maxImages && (
        <Card className="border-dashed border-2 border-border hover:border-primary/50 transition-colors">
          <div className="p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full h-auto p-4 flex flex-col gap-2"
            >
              {uploading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <Image className="h-8 w-8" />
              )}
              <span className="text-sm">
                {uploading ? 'Uploading...' : 'Click to upload images'}
              </span>
              <span className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 10MB
              </span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;
