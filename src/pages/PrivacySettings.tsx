
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Globe, Lock, MapPin, Sparkles, Shield, Eye } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';

const PrivacySettings = () => {
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const thoughtType = routerLocation.state?.thoughtType;

  const handleNext = () => {
    navigate('/details', { 
      state: { 
        thoughtType, 
        privacy, 
        location: privacy === 'public' ? location : '' 
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8 animate-slide-up">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-card rounded-full px-6 py-3 border border-border">
                <Shield className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm font-medium">Step 2 of 5</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="text-gradient">Who can see this?</span> 👀
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your privacy, your rules. Choose wisely and keep it real! 🔒✨
              </p>
            </div>

            {/* Current Selection Info */}
            <div className="bg-secondary/30 rounded-2xl p-4 border border-border/50">
              <p className="text-center">
                <span className="text-muted-foreground">Creating thoughts about:</span>
                <span className="text-primary font-semibold ml-2">{thoughtType}</span>
              </p>
            </div>

            {/* Privacy Options */}
            <div className="space-y-6">
              {/* Public Option */}
              <div
                onClick={() => setPrivacy('public')}
                className={`
                  relative overflow-hidden rounded-3xl p-8 border cursor-pointer transition-all duration-300 transform hover:scale-102
                  ${privacy === 'public' 
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                    : 'border-border hover:border-primary/50 bg-gradient-card'
                  }
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5"></div>
                
                <div className="relative flex items-start space-x-6">
                  <div className={`p-4 rounded-2xl ${privacy === 'public' ? 'bg-primary/20' : 'bg-secondary/50'}`}>
                    <Globe className={`h-8 w-8 ${privacy === 'public' ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-2xl font-bold">Public</h3>
                      <span className="text-2xl">🌍</span>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Everyone can see your thoughts. Perfect for sharing experiences with the community and getting discovered!
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center space-x-3 text-sm">
                        <Eye className="h-4 w-4 text-green-500" />
                        <span>Discoverable by everyone</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        <span>Higher engagement</span>
                      </div>
                    </div>

                    {privacy === 'public' && (
                      <div className="bg-secondary/50 rounded-xl p-4 animate-fade-in border border-primary/20">
                        <p className="text-primary font-medium mb-3">💡 Add location to make it more discoverable!</p>
                        
                        <div className="space-y-3">
                          <Label htmlFor="location" className="flex items-center space-x-2 text-base">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>Location (Optional)</span>
                          </Label>
                          <Input
                            id="location"
                            placeholder="e.g., Goa, Mumbai, Café Coffee Day, Delhi University..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="bg-background/50 border-border focus:border-primary text-base py-3"
                          />
                          <p className="text-sm text-muted-foreground">
                            📍 Help others discover your thoughts about this place!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Private Option */}
              <div
                onClick={() => setPrivacy('private')}
                className={`
                  relative overflow-hidden rounded-3xl p-8 border cursor-pointer transition-all duration-300 transform hover:scale-102
                  ${privacy === 'private' 
                    ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20' 
                    : 'border-border hover:border-accent/50 bg-gradient-card'
                  }
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5"></div>
                
                <div className="relative flex items-start space-x-6">
                  <div className={`p-4 rounded-2xl ${privacy === 'private' ? 'bg-accent/20' : 'bg-secondary/50'}`}>
                    <Lock className={`h-8 w-8 ${privacy === 'private' ? 'text-accent' : 'text-muted-foreground'}`} />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-2xl font-bold">Private</h3>
                      <span className="text-2xl">🔒</span>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Only you can see this. You can share it later with a special link if you want to!
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center space-x-3 text-sm">
                        <Shield className="h-4 w-4 text-purple-500" />
                        <span>Complete privacy control</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <Lock className="h-4 w-4 text-indigo-500" />
                        <span>Shareable by link only</span>
                      </div>
                    </div>

                    {privacy === 'private' && (
                      <div className="bg-secondary/50 rounded-xl p-4 animate-fade-in border border-accent/20">
                        <p className="text-accent font-medium">🎯 Perfect for personal thoughts and sensitive content</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="text-center pt-6">
              <Button 
                size="lg"
                onClick={handleNext}
                className="bg-gradient-primary hover:opacity-90 transition-all group px-8 py-4 text-lg font-semibold rounded-2xl"
              >
                Continue to Details
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
