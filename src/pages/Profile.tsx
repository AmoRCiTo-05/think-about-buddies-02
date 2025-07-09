
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Calendar, MessageSquare, Lock, Globe, RefreshCw, Plus, Users, Camera, Share2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import EditThoughtDialog from '@/components/EditThoughtDialog';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string;
  bio: string;
  created_at: string;
}

interface Thought {
  id: string;
  type: string;
  title: string;
  content: string;
  privacy: string;
  location: string;
  location_verified: boolean;
  custom_category: string;
  tags: string[];
  mentioned_users: string[];
  image_urls: string[];
  images: any;
  created_at: string;
  updated_at?: string;
}

const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingThought, setDeletingThought] = useState<string | null>(null);
  const [editingThought, setEditingThought] = useState<Thought | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfileAndThoughts();
    }
  }, [user]);

  const fetchProfileAndThoughts = async () => {
    if (!user) return;
    
    setLoadingData(true);
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast.error('Failed to load profile');
      } else {
        setProfile(profileData);
      }

      // Fetch thoughts
      const { data: thoughtsData, error: thoughtsError } = await supabase
        .from('thoughts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (thoughtsError) {
        console.error('Error fetching thoughts:', thoughtsError);
        toast.error('Failed to load thoughts');
      } else {
        setThoughts(thoughtsData || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while loading data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProfileAndThoughts();
    setRefreshing(false);
    toast.success('Profile refreshed!');
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Error signing out');
    }
  };

  const handleDeleteThought = async (thoughtId: string) => {
    setDeletingThought(thoughtId);
    try {
      const { error } = await supabase
        .from('thoughts')
        .delete()
        .eq('id', thoughtId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setThoughts(thoughts.filter(t => t.id !== thoughtId));
      toast.success('Thought deleted successfully');
    } catch (error) {
      console.error('Error deleting thought:', error);
      toast.error('Failed to delete thought');
    } finally {
      setDeletingThought(null);
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

  if (loading || loadingData) {
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
                  <div className="space-y-2">
                    <CardTitle className="text-2xl text-gradient flex items-center gap-2">
                      <User className="h-6 w-6" />
                      <strong>{profile?.username || 'Loading...'}</strong>
                    </CardTitle>
                    {profile?.full_name && (
                      <p className="text-muted-foreground font-medium">{profile.full_name}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <strong>Joined {new Date(profile?.created_at || '').toLocaleDateString()}</strong>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleShareProfile}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRefresh}
                      disabled={refreshing}
                    >
                      <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button variant="outline" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{thoughts.length}</div>
                    <div className="text-sm text-muted-foreground font-medium">Total Thoughts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {thoughts.filter(t => t.privacy === 'public').length}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Public Thoughts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {thoughts.reduce((total, t) => total + (t.image_urls?.length || 0), 0)}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Photos Shared</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thoughts History */}
            <Card className="bg-gradient-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <strong>Your Thoughts History ({thoughts.length})</strong>
                </CardTitle>
                <Button onClick={() => navigate('/create')} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Thought
                </Button>
              </CardHeader>
              <CardContent>
                {thoughts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">💭</div>
                    <h3 className="text-lg font-semibold mb-2">No thoughts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start sharing your thoughts about trips, people, and places!
                    </p>
                    <Button onClick={() => navigate('/create')} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create Your First Thought
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {thoughts.map((thought) => (
                      <Card key={thought.id} className="bg-secondary/50 hover-lift transition-all">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getTypeIcon(thought.type)}</span>
                              <h3 className="font-bold text-lg">{thought.title}</h3>
                              {thought.privacy === 'private' ? (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Globe className="h-4 w-4 text-green-500" />
                              )}
                              {thought.updated_at && (
                                <Badge variant="outline" className="text-xs">
                                  <strong>EDITED</strong>
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-semibold">
                                {thought.type === 'other' ? thought.custom_category : thought.type}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingThought(thought)}
                              >
                                <Edit className="h-4 w-4 text-primary" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={deletingThought === thought.id}
                                  >
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
                                      onClick={() => handleDeleteThought(thought.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                            {thought.content}
                          </p>

                          {/* Images Display */}
                          {thought.image_urls && thought.image_urls.length > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Camera className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground font-medium">
                                  <strong>{thought.image_urls.length} photo{thought.image_urls.length > 1 ? 's' : ''}</strong>
                                </span>
                              </div>
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
                                          <strong>+{thought.image_urls.length - 6}</strong>
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
                              <strong>{new Date(thought.created_at).toLocaleDateString()}</strong>
                            </div>
                            
                            {thought.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <strong>{thought.location}</strong>
                                {thought.location_verified && (
                                  <span className="text-green-500">✓</span>
                                )}
                              </div>
                            )}
                            
                            {thought.mentioned_users && thought.mentioned_users.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <strong>@{thought.mentioned_users.join(', @')}</strong>
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

      {/* Edit Thought Dialog */}
      {editingThought && (
        <EditThoughtDialog
          open={!!editingThought}
          onOpenChange={(open) => !open && setEditingThought(null)}
          thought={editingThought}
          onUpdate={fetchProfileAndThoughts}
        />
      )}
    </div>
  );
};

export default Profile;
