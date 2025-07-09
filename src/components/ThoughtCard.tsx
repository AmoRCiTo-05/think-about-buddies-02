import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { User, MapPin, Calendar, Globe, Heart, MessageCircle, Edit, Trash2, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import UserProfileCard from './UserProfileCard';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
  showActions?: boolean;
  onDelete?: (thoughtId: string) => void;
  onUpdate?: () => void;
  compact?: boolean;
}

interface Reply {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  username: string;
  user_full_name: string;
}

const ThoughtCard = ({ thought, showActions = false, onDelete, onUpdate, compact = false }: ThoughtCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trip': return '✈️';
      case 'person': return '👤';
      case 'place': return '📍';
      default: return '💭';
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like thoughts');
      return;
    }

    try {
      if (liked) {
        const { error } = await supabase
          .from('thought_likes')
          .delete()
          .eq('thought_id', thought.id)
          .eq('user_id', user.id);

        if (error) throw error;
        setLiked(false);
        setLikeCount(prev => prev - 1);
        toast.success('Unliked thought');
      } else {
        const { error } = await supabase
          .from('thought_likes')
          .insert({ thought_id: thought.id, user_id: user.id });

        if (error) throw error;
        setLiked(true);
        setLikeCount(prev => prev + 1);
        toast.success('Liked thought');
      }
    } catch (error) {
      console.error('Error liking thought:', error);
      toast.error('Failed to update like status');
    }
  };

  const fetchReplies = async () => {
    setLoadingReplies(true);
    try {
      const { data: repliesData, error } = await supabase
        .from('thought_replies')
        .select(`
          id,
          content,
          created_at,
          user_id
        `)
        .eq('thought_id', thought.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get user profiles for replies
      const userIds = [...new Set(repliesData?.map(r => r.user_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, username, full_name')
        .in('user_id', userIds);

      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.user_id, profile);
      });

      const formattedReplies = repliesData?.map(reply => {
        const profile = profilesMap.get(reply.user_id);
        return {
          ...reply,
          username: profile?.username || 'Unknown',
          user_full_name: profile?.full_name || 'Unknown User'
        };
      }) || [];

      setReplies(formattedReplies);
    } catch (error) {
      console.error('Error fetching replies:', error);
      toast.error('Failed to load replies');
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleToggleReplies = () => {
    if (!showReplies) {
      fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  const handleSubmitReply = async () => {
    if (!user) {
      toast.error('Please sign in to reply');
      return;
    }

    if (!newReply.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setSubmittingReply(true);
    try {
      const { error } = await supabase
        .from('thought_replies')
        .insert({
          thought_id: thought.id,
          user_id: user.id,
          content: newReply.trim()
        });

      if (error) throw error;

      setNewReply('');
      toast.success('Reply posted');
      fetchReplies(); // Refresh replies
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleShare = async () => {
    const thoughtUrl = `${window.location.origin}/thought/${thought.id}`;
    try {
      await navigator.clipboard.writeText(thoughtUrl);
      toast.success('Thought link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy thought link');
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      onDelete(thought.id);
    }
  };

  return (
    <Card className={`${compact ? 'p-2' : 'p-4'} hover-lift transition-all`}>
      <CardContent className={compact ? 'p-2' : 'p-4'}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTypeIcon(thought.type)}</span>
            <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}>{thought.title}</h3>
            <Globe className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={compact ? 'text-xs' : ''}>
              {thought.type}
            </Badge>
            {showActions && user && user.id === thought.user_id && (
              <div className="flex gap-1">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Thought</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this thought? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
        
        <div 
          className={`text-muted-foreground mb-3 cursor-pointer ${expanded ? '' : 'line-clamp-3'}`}
          onClick={() => setExpanded(!expanded)}
        >
          {thought.content}
        </div>

        {/* Images Display */}
        {thought.image_urls && thought.image_urls.length > 0 && (
          <div className="mb-3">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {thought.image_urls.slice(0, expanded ? thought.image_urls.length : 6).map((imageUrl, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <div className="relative aspect-square cursor-pointer">
                      <img
                        src={imageUrl}
                        alt={`Memory ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-border hover:opacity-80 transition-opacity"
                      />
                      {!expanded && index === 5 && thought.image_urls.length > 6 && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            +{thought.image_urls.length - 6}
                          </span>
                        </div>
                      )}
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Photo {index + 1}</DialogTitle>
                    </DialogHeader>
                    <img
                      src={imageUrl}
                      alt={`Memory ${index + 1}`}
                      className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                    />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
          <div 
            className="flex items-center gap-1 cursor-pointer hover:text-primary"
            onClick={() => navigate(`/profile/${thought.username}`)}
          >
            <User className="h-3 w-3" />
            @{thought.username}
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(thought.created_at).toLocaleDateString()}
          </div>
          
          {thought.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {thought.location}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-1 ${liked ? 'text-red-500' : ''}`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              {likeCount > 0 && <span>{likeCount}</span>}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleReplies}
              className="flex items-center gap-1"
            >
              <MessageCircle className="h-4 w-4" />
              {replies.length > 0 && <span>{replies.length}</span>}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* User Profile Card */}
        {user && user.id !== thought.user_id && (
          <div className="mt-3">
            <UserProfileCard
              userId={thought.user_id}
              username={thought.username}
              fullName={thought.user_full_name}
              showFollowButton={true}
              compact={true}
            />
          </div>
        )}

        {/* Replies Section */}
        {showReplies && (
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="font-semibold mb-3">Replies</h4>
            
            {/* Reply Input */}
            {user && (
              <div className="mb-4">
                <Textarea
                  placeholder="Write a reply..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="mb-2"
                  rows={3}
                />
                <Button
                  onClick={handleSubmitReply}
                  disabled={submittingReply || !newReply.trim()}
                  size="sm"
                >
                  {submittingReply ? 'Posting...' : 'Post Reply'}
                </Button>
              </div>
            )}

            {/* Replies List */}
            <div className="space-y-3">
              {loadingReplies ? (
                <div className="text-center text-muted-foreground">Loading replies...</div>
              ) : replies.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  {user ? 'Be the first to reply!' : 'Sign in to see and post replies'}
                </div>
              ) : (
                replies.map((reply) => (
                  <div key={reply.id} className="bg-secondary/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="font-semibold text-sm cursor-pointer hover:text-primary"
                        onClick={() => navigate(`/profile/${reply.username}`)}
                      >
                        @{reply.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(reply.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{reply.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {thought.tags && thought.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {thought.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThoughtCard;