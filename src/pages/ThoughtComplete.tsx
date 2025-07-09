
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Sparkles, Camera, Users, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { toast } from 'sonner';

const ThoughtComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { thoughtData } = location.state || {};

  useEffect(() => {
    if (thoughtData && user && !saved) {
      saveThought();
    }
  }, [thoughtData, user, saved]);

  const saveThought = async () => {
    if (!user || !thoughtData) return;

    setSaving(true);
    try {
      // Collect all images from people and places
      const allImages: string[] = [];
      
      // Add people images
      Object.values(thoughtData.peopleImages || {}).forEach((images: any) => {
        if (Array.isArray(images)) {
          allImages.push(...images);
        }
      });
      
      // Add place images
      Object.values(thoughtData.placeImages || {}).forEach((images: any) => {
        if (Array.isArray(images)) {
          allImages.push(...images);
        }
      });

      // Create the thought content
      const content = Object.entries(thoughtData.thoughts || {})
        .map(([key, thought]) => {
          const [type, name] = key.split('-');
          return `**${type === 'person' ? '👤' : '📍'} ${name}:**\n${thought}`;
        })
        .join('\n\n');

      const thoughtTitle = `${thoughtData.thoughtType.charAt(0).toUpperCase() + thoughtData.thoughtType.slice(1)} Memory`;

      const { data, error } = await supabase
        .from('thoughts')
        .insert({
          user_id: user.id,
          type: thoughtData.thoughtType,
          title: thoughtTitle,
          content: content,
          privacy: thoughtData.privacy,
          location: thoughtData.location,
          mentioned_users: thoughtData.people || [],
          image_urls: allImages,
          images: {
            people: thoughtData.peopleImages || {},
            places: thoughtData.placeImages || {}
          }
        })
        .select();

      if (error) {
        console.error('Error saving thought:', error);
        toast.error('Failed to save your thought');
      } else {
        console.log('Thought saved successfully:', data);
        setSaved(true);
        toast.success('Your thought has been saved!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  if (!thoughtData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No thought data found</h2>
          <Button onClick={() => navigate('/create')}>Create a new thought</Button>
        </div>
      </div>
    );
  }

  const totalImages = Object.values(thoughtData.peopleImages || {}).flat().length + 
                     Object.values(thoughtData.placeImages || {}).flat().length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-24 px-4 pb-8">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8 animate-slide-up">
            {/* Success Header */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="text-gradient">You did it!</span> 🎉
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {saving ? 'Saving your thought...' : saved ? 'Your thought has been saved and is ready to be shared!' : 'Processing your thought...'}
              </p>
            </div>

            {/* Summary Card */}
            <Card className="bg-gradient-card border-border">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">Your Thought Summary</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-secondary/50 rounded-2xl">
                      <div className="text-2xl font-bold text-primary">{thoughtData.thoughtType}</div>
                      <div className="text-sm text-muted-foreground">Type</div>
                    </div>
                    
                    <div className="text-center p-4 bg-secondary/50 rounded-2xl">
                      <div className="text-2xl font-bold text-primary">
                        {thoughtData.privacy === 'public' ? '🌍' : '🔒'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {thoughtData.privacy === 'public' ? 'Public' : 'Private'}
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-secondary/50 rounded-2xl">
                      <div className="text-2xl font-bold text-primary">{totalImages}</div>
                      <div className="text-sm text-muted-foreground">Photos Added</div>
                    </div>
                  </div>

                  {/* People and Places Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {thoughtData.people && thoughtData.people.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-purple-500" />
                          <h3 className="font-semibold">People ({thoughtData.people.length})</h3>
                        </div>
                        <div className="space-y-2">
                          {thoughtData.people.map((person: string, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                              <span>{person}</span>
                              {thoughtData.peopleImages[person] && (
                                <div className="flex items-center space-x-1">
                                  <Camera className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {thoughtData.peopleImages[person].length}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {thoughtData.places && thoughtData.places.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-green-500" />
                          <h3 className="font-semibold">Places ({thoughtData.places.length})</h3>
                        </div>
                        <div className="space-y-2">
                          {thoughtData.places.map((place: string, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                              <span>{place}</span>
                              {thoughtData.placeImages[place] && (
                                <div className="flex items-center space-x-1">
                                  <Camera className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {thoughtData.placeImages[place].length}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {thoughtData.location && (
                    <div className="p-4 bg-secondary/30 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span className="font-medium">Location: {thoughtData.location}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/create')}
                className="flex-1 border-primary text-primary hover:bg-primary/10 py-3 rounded-xl"
                disabled={saving}
              >
                Create Another
              </Button>
              
              <Button 
                size="lg"
                onClick={() => navigate('/profile')}
                className="flex-1 bg-gradient-primary hover:opacity-90 transition-all group py-3 rounded-xl"
                disabled={saving}
              >
                View Your Thoughts
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {saving && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Saving your thought...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThoughtComplete;
