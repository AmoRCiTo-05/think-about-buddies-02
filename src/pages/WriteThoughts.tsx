
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Users, MapPin, Save, PenTool, Sparkles, Camera } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';

const WriteThoughts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    thoughtType, 
    privacy, 
    location: thoughtLocation, 
    people, 
    places,
    peopleImages = {},
    placeImages = {}
  } = location.state || {};
  
  const [thoughts, setThoughts] = useState<{[key: string]: string}>({});

  const updateThought = (key: string, value: string) => {
    setThoughts(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    const thoughtData = {
      thoughtType,
      privacy,
      location: thoughtLocation,
      people,
      places,
      thoughts,
      peopleImages,
      placeImages
    };
    
    navigate('/complete', { state: { thoughtData } });
  };

  const allEntities = [
    ...(people || []).map((person: string) => ({ 
      type: 'person', 
      name: person, 
      icon: Users,
      images: peopleImages[person] || []
    })),
    ...(places || []).map((place: string) => ({ 
      type: 'place', 
      name: place, 
      icon: MapPin,
      images: placeImages[place] || []
    }))
  ].filter(entity => entity.name.trim() !== '');

  const completedThoughts = Object.values(thoughts).filter(thought => thought.trim() !== '').length;
  const totalEntities = allEntities.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-24 px-4 pb-8">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-8 animate-slide-up">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-card rounded-full px-6 py-3 border border-border">
                <PenTool className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm font-medium">Step 4 of 5</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="text-gradient">Spill your thoughts</span> 💭
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Time to get real! Write what you actually think about each person and place. Be honest, be you! 🔥✨
              </p>
            </div>

            {/* Progress Bar */}
            <div className="bg-gradient-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-medium">Progress</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {completedThoughts} of {totalEntities} completed
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalEntities > 0 ? (completedThoughts / totalEntities) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Current Context */}
            <div className="bg-secondary/30 rounded-2xl p-6 border border-border/50">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Writing thoughts about</p>
                <div className="flex items-center justify-center flex-wrap gap-4 text-sm">
                  <span className="text-primary font-semibold">{thoughtType}</span>
                  {privacy === 'public' && thoughtLocation && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">📍 {thoughtLocation}</span>
                    </>
                  )}
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {privacy === 'public' ? '🌍 Public' : '🔒 Private'}
                  </span>
                </div>
              </div>
            </div>

            {allEntities.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-card rounded-3xl p-8 border border-border max-w-md mx-auto">
                  <div className="space-y-4">
                    <div className="text-4xl">😅</div>
                    <h3 className="text-xl font-bold">Oops! No details added</h3>
                    <p className="text-muted-foreground">
                      You need to add some people or places first before writing your thoughts!
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/details')}
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      Go back to add details
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {allEntities.map((entity, index) => {
                  const IconComponent = entity.icon;
                  const thoughtKey = `${entity.type}-${entity.name}`;
                  const currentThought = thoughts[thoughtKey] || '';
                  const isCompleted = currentThought.trim() !== '';
                  
                  return (
                    <div key={`${entity.type}-${index}`} className="bg-gradient-card rounded-3xl p-8 border border-border backdrop-blur-sm">
                      <div className="space-y-6">
                        {/* Entity Header */}
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-2xl ${
                            entity.type === 'person' ? 'bg-purple-500/20' : 'bg-green-500/20'
                          }`}>
                            <IconComponent className={`h-6 w-6 ${
                              entity.type === 'person' ? 'text-purple-500' : 'text-green-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-2xl font-bold">
                                {entity.type === 'person' ? '👤' : '📍'} {entity.name}
                              </h3>
                              {isCompleted && (
                                <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-medium">
                                  ✓ Done
                                </div>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {entity.type === 'person' 
                                ? 'Share your honest thoughts about this person'
                                : 'Describe your experience at this place'
                              }
                            </p>
                          </div>
                        </div>

                        {/* Images Preview */}
                        {entity.images.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Camera className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {entity.images.length} photo{entity.images.length > 1 ? 's' : ''} added
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {entity.images.map((imageUrl, imgIndex) => (
                                <div key={imgIndex} className="relative">
                                  <img
                                    src={imageUrl}
                                    alt={`${entity.name} ${imgIndex + 1}`}
                                    className="w-full h-20 object-cover rounded-lg border border-border"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Textarea */}
                        <div className="space-y-3">
                          <Textarea
                            placeholder={
                              entity.type === 'person' 
                                ? `What do you really think about ${entity.name}? Be honest but respectful... 😏`
                                : `How was ${entity.name}? What made it special or not so special? Describe the vibe! 🤔`
                            }
                            value={currentThought}
                            onChange={(e) => updateThought(thoughtKey, e.target.value)}
                            className="min-h-[150px] bg-secondary/50 border-border focus:border-primary resize-none text-base leading-relaxed"
                            rows={6}
                          />
                          
                          <div className="flex items-center justify-between text-xs">
                            <p className="text-muted-foreground">
                              {entity.type === 'person' 
                                ? "💡 Pro tip: Be genuine but respectful. This is about honest thoughts!"
                                : "💡 Describe the vibe, the experience, what you loved or didn't love"
                              }
                            </p>
                            <span className="text-muted-foreground">
                              {currentThought.length} characters
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {allEntities.length > 0 && (
              <div className="space-y-6">
                {/* Motivation Box */}
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">🔥</div>
                    <div>
                      <p className="font-medium mb-2">Remember: This is your space to be real!</p>
                      <p className="text-muted-foreground text-sm">
                        Share what you genuinely felt and experienced. Your authentic thoughts make the best stories! ✨
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="outline"
                    onClick={handleSave}
                    className="flex-1 border-primary text-primary hover:bg-primary/10 py-3 rounded-xl"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                  
                  <Button 
                    size="lg"
                    onClick={handleSave}
                    className="flex-1 bg-gradient-primary hover:opacity-90 transition-all group py-3 rounded-xl"
                  >
                    Finish & Share
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteThoughts;
