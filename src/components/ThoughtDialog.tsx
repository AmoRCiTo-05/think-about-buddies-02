
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ThoughtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  thought: {
    id: string;
    title: string;
    content: string;
    type: string;
    location: string;
    tags: string[];
    image_urls: string[];
    created_at: string;
    username: string;
    user_full_name: string;
  };
}

const ThoughtDialog = ({ open, onOpenChange, thought }: ThoughtDialogProps) => {
  const formatContent = (content: string) => {
    // Split content by double line breaks to create paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Check if the paragraph looks like a heading (short and in caps or title case)
      const isHeading = paragraph.length < 50 && (
        paragraph === paragraph.toUpperCase() || 
        paragraph.split(' ').every(word => word[0]?.toUpperCase() === word[0])
      );
      
      if (isHeading) {
        return (
          <h3 key={index} className="text-lg font-bold text-foreground mb-3">
            {paragraph}
          </h3>
        );
      }
      
      // Process the paragraph for bold text (words surrounded by asterisks or capitals)
      const processedText = paragraph.split(' ').map((word, wordIndex) => {
        // Check if word is surrounded by asterisks
        if (word.startsWith('*') && word.endsWith('*') && word.length > 2) {
          return (
            <span key={wordIndex} className="font-bold">
              {word.slice(1, -1)}{' '}
            </span>
          );
        }
        
        // Check if word is all caps (likely emphasis)
        if (word.length > 2 && word === word.toUpperCase() && /^[A-Z]+$/.test(word)) {
          return (
            <span key={wordIndex} className="font-bold">
              {word}{' '}
            </span>
          );
        }
        
        return word + ' ';
      });
      
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-4">
          {processedText}
        </p>
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient mb-2">
            {thought.title}
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium">by {thought.user_full_name || thought.username}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(thought.created_at), { addSuffix: true })}</span>
            </div>
            {thought.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{thought.location}</span>
              </div>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Images */}
          {thought.image_urls && thought.image_urls.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Photos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {thought.image_urls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Thought image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-border"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Thought</h4>
            <div className="prose prose-sm max-w-none">
              {formatContent(thought.content)}
            </div>
          </div>
          
          {/* Tags and Type */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">
              {thought.type}
            </Badge>
            {thought.tags && thought.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThoughtDialog;
