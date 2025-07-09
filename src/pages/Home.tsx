
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import { toast } from 'sonner';
import UserProfileCard from '@/components/UserProfileCard';
import ThoughtCard from '@/components/ThoughtCard';
import SearchWithAutocomplete from '@/components/SearchWithAutocomplete';

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

  const handleSearch = async (searchTerm: string, type: 'thoughts' | 'users') => {
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
      if (type === 'thoughts') {
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
      {/* Hero Landing Section */}
      <Hero />
      
      <div className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">

            {/* Enhanced Search Section */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Search {searchType === 'thoughts' ? 'Thoughts' : 'Users'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SearchWithAutocomplete
                  onSearch={handleSearch}
                  searchType={searchType}
                  onSearchTypeChange={setSearchType}
                  isSearching={isSearching}
                />
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
                      {searchResults.length === 0 && searchType === 'thoughts' ? 'No thoughts found' : 'No public thoughts yet'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchResults.length === 0 && searchType === 'thoughts'
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
