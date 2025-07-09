import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { toast } from 'sonner';
import ThoughtCard from '@/components/ThoughtCard';

interface LikedThought {
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
}

const LikedThoughts = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [likedThoughts, setLikedThoughts] = useState<LikedThought[]>([]);
  const [loadingThoughts, setLoadingThoughts] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchLikedThoughts();
    }
  }, [user]);

  const fetchLikedThoughts = async () => {
    if (!user) return;
    
    setLoadingThoughts(true);
    try {
      // Get liked thought IDs
      const { data: likesData, error: likesError } = await supabase
        .from('thought_likes')
        .select('thought_id')
        .eq('user_id', user.id);

      if (likesError) throw likesError;

      const thoughtIds = likesData?.map(like => like.thought_id) || [];

      if (thoughtIds.length === 0) {
        setLikedThoughts([]);
        return;
      }

      // Get the thoughts
      const { data: thoughtsData, error: thoughtsError } = await supabase
        .from('thoughts')
        .select('*')
        .in('id', thoughtIds)
        .eq('privacy', 'public')
        .order('created_at', { ascending: false });

      if (thoughtsError) throw thoughtsError;

      // Get user profiles for these thoughts
      const userIds = [...new Set(thoughtsData?.map(thought => thought.user_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, username, full_name')
        .in('user_id', userIds);

      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.user_id, profile);
      });

      const formattedThoughts = thoughtsData?.map(thought => {
        const profile = profilesMap.get(thought.user_id);
        return {
          ...thought,
          username: profile?.username || 'Unknown',
          user_full_name: profile?.full_name || 'Unknown User'
        };
      }) || [];

      setLikedThoughts(formattedThoughts);
    } catch (error) {
      console.error('Error fetching liked thoughts:', error);
      toast.error('Failed to load liked thoughts');
    } finally {
      setLoadingThoughts(false);
    }
  };

  if (loading || loadingThoughts) {
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
                  <Heart className="h-6 w-6 text-red-500" />
                  Liked Thoughts
                </CardTitle>
                <p className="text-muted-foreground">
                  Thoughts you've liked from other users
                </p>
              </CardHeader>
            </Card>

            {/* Liked Thoughts */}
            <div>
              {likedThoughts.length === 0 ? (
                <Card className="bg-gradient-card border-border">
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl mb-4">💝</div>
                    <h3 className="text-lg font-semibold mb-2">No liked thoughts yet</h3>
                    <p className="text-muted-foreground">
                      Start exploring and liking thoughts from other users!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {likedThoughts.map((thought) => (
                    <ThoughtCard
                      key={thought.id}
                      thought={thought}
                      onUpdate={fetchLikedThoughts}
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

export default LikedThoughts;