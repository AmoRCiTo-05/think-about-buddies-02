import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { toast } from 'sonner';
import UserProfileCard from '@/components/UserProfileCard';

interface FollowerProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  avatar_url: string;
  bio: string;
}

const Followers = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [followerProfiles, setFollowerProfiles] = useState<FollowerProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchFollowerProfiles();
    }
  }, [user]);

  const fetchFollowerProfiles = async () => {
    if (!user) return;
    
    setLoadingProfiles(true);
    try {
      // Get follower user IDs
      const { data: followsData, error: followsError } = await supabase
        .from('user_follows')
        .select('follower_id')
        .eq('following_id', user.id);

      if (followsError) throw followsError;

      const userIds = followsData?.map(follow => follow.follower_id) || [];

      if (userIds.length === 0) {
        setFollowerProfiles([]);
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

      setFollowerProfiles(formattedProfiles);
    } catch (error) {
      console.error('Error fetching followers:', error);
      toast.error('Failed to load followers');
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
                  <Users className="h-6 w-6 text-green-500" />
                  Followers ({followerProfiles.length})
                </CardTitle>
                <p className="text-muted-foreground">
                  Users who are following you
                </p>
              </CardHeader>
            </Card>

            {/* Follower Profiles */}
            <div>
              {followerProfiles.length === 0 ? (
                <Card className="bg-gradient-card border-border">
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl mb-4">👥</div>
                    <h3 className="text-lg font-semibold mb-2">No followers yet</h3>
                    <p className="text-muted-foreground">
                      Share interesting thoughts to attract followers!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {followerProfiles.map((profile) => (
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

export default Followers;