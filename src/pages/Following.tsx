import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { toast } from 'sonner';
import UserProfileCard from '@/components/UserProfileCard';

interface FollowingProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  avatar_url: string;
  bio: string;
}

const Following = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [followingProfiles, setFollowingProfiles] = useState<FollowingProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchFollowingProfiles();
    }
  }, [user]);

  const fetchFollowingProfiles = async () => {
    if (!user) return;
    
    setLoadingProfiles(true);
    try {
      // Get following user IDs
      const { data: followsData, error: followsError } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (followsError) throw followsError;

      const userIds = followsData?.map(follow => follow.following_id) || [];

      if (userIds.length === 0) {
        setFollowingProfiles([]);
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

      setFollowingProfiles(formattedProfiles);
    } catch (error) {
      console.error('Error fetching following profiles:', error);
      toast.error('Failed to load following profiles');
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
                  <UserPlus className="h-6 w-6 text-blue-500" />
                  Following ({followingProfiles.length})
                </CardTitle>
                <p className="text-muted-foreground">
                  Users you're following
                </p>
              </CardHeader>
            </Card>

            {/* Following Profiles */}
            <div>
              {followingProfiles.length === 0 ? (
                <Card className="bg-gradient-card border-border">
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl mb-4">👥</div>
                    <h3 className="text-lg font-semibold mb-2">Not following anyone yet</h3>
                    <p className="text-muted-foreground">
                      Start following users to see their latest thoughts and updates!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {followingProfiles.map((profile) => (
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

export default Following;