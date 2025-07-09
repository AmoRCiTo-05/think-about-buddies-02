
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Star, UserPlus, UserMinus, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UserProfileCardProps {
  userId: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  showFollowButton?: boolean;
  compact?: boolean;
}

const UserProfileCard = ({ 
  userId, 
  username, 
  fullName, 
  avatarUrl, 
  bio, 
  showFollowButton = true,
  compact = false 
}: UserProfileCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (!user) {
      toast.error('Please sign in to follow users');
      return;
    }

    setLoading(true);
    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);

        if (error) throw error;
        setIsFollowing(false);
        toast.success('Unfollowed user');
      } else {
        const { error } = await supabase
          .from('user_follows')
          .insert({ follower_id: user.id, following_id: userId });

        if (error) throw error;
        setIsFollowing(true);
        toast.success('Following user');
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      toast.error('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please sign in to bookmark profiles');
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('user_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('bookmarked_user_id', userId);

        if (error) throw error;
        setIsBookmarked(false);
        toast.success('Removed bookmark');
      } else {
        const { error } = await supabase
          .from('user_bookmarks')
          .insert({ user_id: user.id, bookmarked_user_id: userId });

        if (error) throw error;
        setIsBookmarked(true);
        toast.success('Profile bookmarked');
      }
    } catch (error) {
      console.error('Error bookmarking profile:', error);
      toast.error('Failed to update bookmark status');
    } finally {
      setLoading(false);
    }
  };

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${username}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy profile link');
    }
  };

  const handleViewProfile = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <Card className={`${compact ? 'p-2' : 'p-4'} hover-lift transition-all cursor-pointer`}>
      <CardContent className={compact ? 'p-2' : 'p-4'}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3" onClick={handleViewProfile}>
            <Avatar className={compact ? 'h-8 w-8' : 'h-12 w-12'}>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                <User className={compact ? 'h-4 w-4' : 'h-6 w-6'} />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}>
                @{username}
              </h3>
              {fullName && (
                <p className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
                  {fullName}
                </p>
              )}
              {bio && !compact && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {bio}
                </p>
              )}
            </div>
          </div>
          
          {user && user.id !== userId && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size={compact ? "sm" : "default"}
                onClick={handleShareProfile}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size={compact ? "sm" : "default"}
                onClick={handleBookmark}
                disabled={loading}
              >
                <Star className={`h-4 w-4 ${isBookmarked ? 'fill-current text-yellow-500' : ''}`} />
              </Button>
              
              {showFollowButton && (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  size={compact ? "sm" : "default"}
                  onClick={handleFollow}
                  disabled={loading}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="h-4 w-4 mr-1" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-1" />
                      Follow
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
