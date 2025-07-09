
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, MapPin, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import ThoughtDialog from './ThoughtDialog';

interface ThoughtCardProps {
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
    user_id: string;
    privacy: string;
  };
}

const ThoughtCard = ({ thought }: ThoughtCardProps) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${thought.username}`);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <>
      <Card 
        className="bg-gradient-card border-border hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gradient line-clamp-2">
                  {thought.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <button 
                    onClick={handleUserClick}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    by {thought.user_full_name || thought.username}
                  </button>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(thought.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="capitalize">
                {thought.type}
              </Badge>
            </div>

            {/* Image Preview */}
            {thought.image_urls && thought.image_urls.length > 0 && (
              <div className="relative">
                <img
                  src={thought.image_urls[0]}
                  alt="Thought preview"
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
                {thought.image_urls.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    +{thought.image_urls.length - 1} more
                  </div>
                )}
              </div>
            )}

            {/* Content Preview */}
            <div className="space-y-2">
              <p className="text-muted-foreground leading-relaxed">
                {truncateContent(thought.content)}
              </p>
            </div>

            {/* Location */}
            {thought.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{thought.location}</span>
              </div>
            )}

            {/* Tags */}
            {thought.tags && thought.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {thought.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
                {thought.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{thought.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:text-red-500">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">Like</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">Comment</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  <span className="text-sm">Share</span>
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDialogOpen(true);
                }}
              >
                Read More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ThoughtDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        thought={thought}
      />
    </>
  );
};

export default ThoughtCard;
