
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Calendar, MessageSquare, Lock, Globe, Share2, Star, UserPlus, UserMinus } from 'lucide-react';
import Header from '@/components/Header';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  created_at: string;
}

interface Thought {
  id: string;
  type: string;
  title: string;
  content: string;
  privacy: string;
  location: string;
  tags: string[];
  image_urls: string[];
  created_at: string;
}

const UserProfile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  useEffect(() => {
    if (user && profile) {
      checkFollowAndBookmarkStatus();
    }
  }, [user, profile]);

  const fetchUserProfile = async () => {
    if (!username) return;
    
    setLoading(true);
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) throw profileError;

      setProfile({
        id: profileData.user_id,
        username: profileData.username,
        email: profileData.email || '',
        full_name: profileData.full_name || '',
        bio: profileData.bio || '',
        avatar_url: profileData.avatar_url || '',
        created_at: profileData.created_at
      });

      // Fetch public thoughts
      const { data: thoughtsData, error: thoughtsError } = await supabase
        .from('thoughts')
        .select('*')
        .eq('user_id', profileData.user_id)
        .eq('privacy', 'public')
        .order('created_at', { ascending: false });

      if (thoughtsError) throw thoughtsError;

      setThoughts(thoughtsData || []);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
      navigate('/not-found');
    } finally {
      setLoading(false);
    }
  };

  const checkFollowAndBookmarkStatus = async () => {
    if (!user || !profile) return;

    try {
      // Check if following
      const { data: followData } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', profile.id)
        .single();

      setIsFollowing(!!followData);

      // Check if bookmarked
      const { data: bookmarkData } = await supabase
        .from('user_bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('bookmarked_user_id', profile.id)
        .single();

      setIsBookmarked(!!bookmarkData);
    } catch (error) {
      // Errors are expected when no records exist
      console.log('No existing follow/bookmark relationships');
    }
  };

  const handleFollow = async () => {
    if (!user || !profile) {
      toast.error('Please sign in to follow users');
      return;
    }

    setActionLoading(true);
    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profile.id);

        if (error) throw error;
        setIsFollowing(false);
        toast.success('Unfollowed user');
      } else {
        const { error } = await supabase
          .from('user_follows')
          .insert({ follower_id: user.id, following_id: profile.id });

        if (error) throw error;
        setIsFollowing(true);
        toast.success('Following user');
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      toast.error('Failed to update follow status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user || !profile) {
      toast.error('Please sign in to bookmark profiles');
      return;
    }

    setActionLoading(true);
    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('user_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('bookmarked_user_id', profile.id);

        if (error) throw error;
        setIsBookmarked(false);
        toast.success('Removed bookmark');
      } else {
        const { error } = await supabase
          .from('user_bookmarks')
          .insert({ user_id: user.id, bookmarked_user_id: profile.id });

        if (error) throw error;
        setIsBookmarked(true);
        toast.success('Profile bookmarked');
      }
    } catch (error) {
      console.error('Error bookmarking profile:', error);
      toast.error('Failed to update bookmark status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShareProfile = async () => {
    if (!profile) return;
    
    const profileUrl = `${window.location.origin}/profile/${profile.username}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy profile link');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trip': return '✈️';
      case 'person': return '👤';
      case 'place': return '📍';
      default: return '💭';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
              <div className="h-32 bg-gray-300 rounded mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-2xl font-bold mb-4">User not found</h1>
            <Button onClick={() => navigate('/')}>Go back home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            {/* Profile Header */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <CardTitle className="text-2xl text-gradient">
                        @{profile.username}
                      </CardTitle>
                      {profile.full_name && (
                        <p className="text-lg text-muted-foreground">{profile.full_name}</p>
                      )}
                      {profile.bio && (
                        <p className="text-muted-foreground">{profile.bio}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Joined {new Date(profile.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {user && user.id !== profile.id && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShareProfile}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBookmark}
                        disabled={actionLoading}
                      >
                        <Star className={`h-4 w-4 ${isBookmarked ? 'fill-current text-yellow-500' : ''}`} />
                      </Button>
                      
                      <Button
                        variant={isFollowing ? "outline" : "default"}
                        size="sm"
                        onClick={handleFollow}
                        disabled={actionLoading}
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
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{thoughts.length}</div>
                    <div className="text-sm text-muted-foreground">Public Thoughts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {thoughts.reduce((total, t) => total + (t.image_urls?.length || 0), 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Photos Shared</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Public Thoughts */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Public Thoughts ({thoughts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {thoughts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">💭</div>
                    <h3 className="text-lg font-semibold mb-2">No public thoughts yet</h3>
                    <p className="text-muted-foreground">
                      This user hasn't shared any public thoughts.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {thoughts.map((thought) => (
                      <Card key={thought.id} className="bg-secondary/50">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getTypeIcon(thought.type)}</span>
                              <h3 className="font-semibold">{thought.title}</h3>
                              <Globe className="h-4 w-4 text-green-500" />
                            </div>
                            <Badge variant="outline">
                              {thought.type}
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground mb-3 line-clamp-3">
                            {thought.content}
                          </p>

                          {thought.image_urls && thought.image_urls.length > 0 && (
                            <div className="mb-3">
                              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                {thought.image_urls.slice(0, 6).map((imageUrl, index) => (
                                  <div key={index} className="relative aspect-square">
                                    <img
                                      src={imageUrl}
                                      alt={`Memory ${index + 1}`}
                                      className="w-full h-full object-cover rounded-lg border border-border"
                                    />
                                    {index === 5 && thought.image_urls.length > 6 && (
                                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                          +{thought.image_urls.length - 6}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(thought.created_at).toLocaleDateString()}
                            </div>
                            
                            {thought.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <strong>{thought.location}</strong>
                              </div>
                            )}
                          </div>
                          
                          {thought.tags && thought.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {thought.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  <strong>#{tag}</strong>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
