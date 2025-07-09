import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { toast } from 'sonner';
import UserProfileCard from '@/components/UserProfileCard';

interface StarredProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  avatar_url: string;
  bio: string;
}

const StarredProfiles = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [starredProfiles, setStarredProfiles] = useState<StarredProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStarredProfiles();
    }
  }, [user]);

  const fetchStarredProfiles = async () => {
    if (!user) return;
    
    setLoadingProfiles(true);
    try {
      // Get bookmarked user IDs
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from('user_bookmarks')
        .select('bookmarked_user_id')
        .eq('user_id', user.id);

      if (bookmarksError) throw bookmarksError;

      const userIds = bookmarksData?.map(bookmark => bookmark.bookmarked_user_id) || [];

      if (userIds.length === 0) {
        setStarredProfiles([]);
        return;
      }

      // Get the profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      const formattedProfiles = profilesData?.map(profile => ({
        id: profile.user_id,
        username: profile.username,
        full_name: profile.full_name || '',
        email: profile.email || '',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || ''
      })) || [];

      setStarredProfiles(formattedProfiles);
    } catch (error) {
      console.error('Error fetching starred profiles:', error);
      toast.error('Failed to load starred profiles');
    } finally {
      setLoadingProfiles(false);
    }
  };

  if (loading || loadingProfiles) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
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
            {/* Header */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-gradient flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  Starred Profiles
                </CardTitle>
                <p className="text-muted-foreground">
                  Profiles you've bookmarked for easy access
                </p>
              </CardHeader>
            </Card>

            {/* Starred Profiles */}
            <div>
              {starredProfiles.length === 0 ? (
                <Card className="bg-gradient-card border-border">
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl mb-4">⭐</div>
                    <h3 className="text-lg font-semibold mb-2">No starred profiles yet</h3>
                    <p className="text-muted-foreground">
                      Start bookmarking profiles to keep track of interesting users!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {starredProfiles.map((profile) => (
                    <UserProfileCard
                      key={profile.id}
                      userId={profile.id}
                      username={profile.username}
                      fullName={profile.full_name}
                      avatarUrl={profile.avatar_url}
                      bio={profile.bio}
                      showFollowButton={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarredProfiles;