
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EditThoughtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  thought: {
    id: string;
    title: string;
    content: string;
    type: string;
    location: string;
    tags: string[];
    custom_category?: string;
  };
  onUpdate: () => void;
}

const EditThoughtDialog = ({ open, onOpenChange, thought, onUpdate }: EditThoughtDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    tags: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && thought) {
      setFormData({
        title: thought.title,
        content: thought.content,
        location: thought.location || '',
        tags: thought.tags?.join(', ') || ''
      });
    }
  }, [open, thought]);

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const { error } = await supabase
        .from('thoughts')
        .update({
          title: formData.title.trim(),
          content: formData.content.trim(),
          location: formData.location.trim() || null,
          tags: tagsArray,
          updated_at: new Date().toISOString()
        })
        .eq('id', thought.id);

      if (error) throw error;

      toast.success('Thought updated successfully');
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating thought:', error);
      toast.error('Failed to update thought');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gradient flex items-center gap-2">
            Edit Thought
            <Badge variant="secondary" className="capitalize">
              {thought.type === 'other' ? thought.custom_category : thought.type}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter thought title"
              className="font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="font-semibold">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share your thoughts... Use **bold** for emphasis"
              className="min-h-[200px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Use **text** to make text bold
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="font-semibold">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter location (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="font-semibold">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Enter tags separated by commas"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditThoughtDialog;
