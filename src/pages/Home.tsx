import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, User, Globe, Camera, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { toast } from 'sonner';
import UserProfileCard from '@/components/UserProfileCard';
import ThoughtCard from '@/components/ThoughtCard';

interface PublicThought {
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

interface SearchedUser {
  id: string;
  username: string;
  full_name: string;
  email: string;
  avatar_url: string;
  bio: string;
}

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [thoughts, setThoughts] = useState<PublicThought[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PublicThought[]>([]);
  const [userSearchResults, setUserSearchResults] = useState<SearchedUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingThoughts, setLoadingThoughts] = useState(true);
  const [searchType, setSearchType] = useState<'thoughts' | 'users'>('thoughts');

  useEffect(() => {
    fetchPublicThoughts();
  }, []);

  const fetchPublicThoughts = async () => {
    setLoadingThoughts(true);
    try {
      // First get the thoughts - prioritize those with images
      const { data: thoughtsData, error: thoughtsError } = await supabase
        .from('thoughts')
        .select('*')
        .eq('privacy', 'public')
        .order('created_at', { ascending: false })
        .limit(50); // Get more to filter for images

      if (thoughtsError) {
        console.error('Error fetching thoughts:', thoughtsError);
        toast.error('Failed to load thoughts');
        return;
      }

      if (!thoughtsData || thoughtsData.length === 0) {
        setThoughts([]);
        return;
      }

      // Prioritize thoughts with images
      const thoughtsWithImages = thoughtsData.filter(t => t.image_urls && t.image_urls.length > 0);
      const thoughtsWithoutImages = thoughtsData.filter(t => !t.image_urls || t.image_urls.length === 0);
      
      // Combine with images first, then without images, limit to 20
      const prioritizedThoughts = [...thoughtsWithImages, ...thoughtsWithoutImages].slice(0, 20);

      // Get unique user IDs from thoughts
      const userIds = [...new Set(prioritizedThoughts.map(thought => thought.user_id))];

      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, username, full_name')
        .in('user_id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast.error('Failed to load user profiles');
        return;
      }

      // Create a map of user_id to profile data
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.user_id, profile);
      });

      // Combine thoughts with profile data
      const formattedThoughts = prioritizedThoughts.map(thought => {
        const profile = profilesMap.get(thought.user_id);
        return {
          id: thought.id,
          title: thought.title,
          content: thought.content,
          type: thought.type,
          location: thought.location,
          tags: thought.tags || [],
          image_urls: thought.image_urls || [],
          created_at: thought.created_at,
          username: profile?.username || 'Unknown',
          user_full_name: profile?.full_name || 'Unknown User',
          user_id: thought.user_id,
          privacy: thought.privacy
        };
      });

      setThoughts(formattedThoughts);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while loading thoughts');
    } finally {
      setLoadingThoughts(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setUserSearchResults([]);
      return;
    }

    if (!user) {
      toast.error('Please sign in to search');
      navigate('/auth');
      return;
    }

    setIsSearching(true);
    try {
      if (searchType === 'thoughts') {
        const { data, error } = await supabase.rpc('search_public_thoughts', {
          search_term: searchTerm
        });

        if (error) {
          console.error('Search error:', error);
          toast.error('Failed to search thoughts');
        } else {
          const formattedResults = data?.map((thought: any) => ({
            ...thought,
            user_id: thought.id // We need to get user_id from somewhere
          })) || [];
          setSearchResults(formattedResults);
          setUserSearchResults([]);
        }
      } else {
        const { data, error } = await supabase.rpc('search_users', {
          search_term: searchTerm
        });

        if (error) {
          console.error('Search error:', error);
          toast.error('Failed to search users');
        } else {
          setUserSearchResults(data || []);
          setSearchResults([]);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('An error occurred while searching');
    } finally {
      setIsSearching(false);
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

  const displayedThoughts = searchResults.length > 0 ? searchResults : thoughts;

  if (loading || loadingThoughts) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
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
            {/* Welcome Section */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gradient mb-4">
                Welcome to Think@Friend
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Discover and share authentic thoughts about trips, people, and places
              </p>
              
              {!user && (
                <div className="bg-gradient-card p-6 rounded-lg border border-border mb-8">
                  <h2 className="text-xl font-semibold mb-2">Join the Community</h2>
                  <p className="text-muted-foreground mb-4">
                    Sign in to search thoughts, follow users, and share your own experiences
                  </p>
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    Sign In to Get Started
                  </Button>
                </div>
              )}
            </div>

            {/* Enhanced Search Section */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search {searchType === 'thoughts' ? 'Thoughts' : 'Users'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={searchType === 'thoughts' ? 'default' : 'outline'}
                      onClick={() => setSearchType('thoughts')}
                      size="sm"
                    >
                      Search Thoughts
                    </Button>
                    <Button
                      variant={searchType === 'users' ? 'default' : 'outline'}
                      onClick={() => setSearchType('users')}
                      size="sm"
                    >
                      Search Users
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder={
                        searchType === 'thoughts' 
                          ? "Search by keywords, places, or users..." 
                          : "Search users by username or name..."
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                  </div>
                  {!user && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Sign in to search for thoughts and users
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Search Results */}
            {userSearchResults.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">User Search Results</h2>
                <div className="space-y-4">
                  {userSearchResults.map((user) => (
                    <UserProfileCard
                      key={user.id}
                      userId={user.id}
                      username={user.username}
                      fullName={user.full_name}
                      avatarUrl={user.avatar_url}
                      bio={user.bio}
                      showFollowButton={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Create Thought CTA for authenticated users */}
            {user && (
              <Card className="bg-gradient-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">Share Your Thoughts</h3>
                      <p className="text-sm text-muted-foreground">
                        Create a new thought about your experiences
                      </p>
                    </div>
                    <Button 
                      onClick={() => navigate('/create')}
                      className="bg-gradient-primary hover:opacity-90 flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Create Thought
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Public Thoughts */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {searchResults.length > 0 ? 'Thought Search Results' : 'Recent Public Thoughts'}
              </h2>
              
              {displayedThoughts.length === 0 ? (
                <Card className="bg-gradient-card border-border">
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold mb-2">
                      {searchResults.length === 0 && searchTerm ? 'No thoughts found' : 'No public thoughts yet'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchResults.length === 0 && searchTerm 
                        ? 'Try searching with different keywords'
                        : 'Be the first to share a public thought!'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {displayedThoughts.map((thought) => (
                    <ThoughtCard
                      key={thought.id}
                      thought={thought}
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

export default Home;
