
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/create');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="pt-32 pb-16 px-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center min-h-[60vh]">
          {/* Left Side - 40% */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <Badge 
                variant="secondary" 
                className="w-fit px-4 py-2 text-sm font-semibold bg-primary/10 text-primary border-primary/20 shadow-sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                organize your thoughts
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="text-gradient">Think</span>
                <span className="text-primary">@</span>
                <span className="text-gradient">Friend</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Discover and share authentic thoughts about trips, people, and places. 
                Connect with a community that values genuine experiences and meaningful connections.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-primary hover:opacity-90 font-semibold px-8 py-4 text-lg shadow-lg"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/about')}
                className="font-semibold px-8 py-4 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Side - 60% with clean design */}
          <div className="lg:col-span-3 relative">
            <div className="relative overflow-hidden">
              {/* Main Card - No rotation, clean design */}
              <Card className="bg-gradient-card border-border shadow-2xl hover:shadow-3xl transition-all duration-300 ml-8 mr-[-2rem] lg:mr-[-4rem]">
                <CardContent className="p-10 text-center relative">
                  {/* Decorative SVG Background */}
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 400 300" fill="none">
                      <defs>
                        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--accent))" />
                        </linearGradient>
                      </defs>
                      <circle cx="100" cy="100" r="60" fill="url(#heroGradient)" opacity="0.3" />
                      <circle cx="300" cy="200" r="40" fill="url(#heroGradient)" opacity="0.2" />
                      <path d="M50 250 Q200 150 350 250" stroke="url(#heroGradient)" strokeWidth="2" fill="none" opacity="0.4" />
                    </svg>
                  </div>
                  
                  <div className="relative space-y-8">
                    <div className="text-8xl mb-6 animate-bounce">
                      💭
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold text-gradient">
                        Share Your Thoughts
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        Join thousands sharing their authentic experiences and building meaningful connections
                      </p>
                      <div className="flex justify-center space-x-4 text-2xl">
                        <span className="animate-pulse">✈️</span>
                        <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>👥</span>
                        <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>📍</span>
                        <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>❤️</span>
                      </div>
                      <Button 
                        onClick={handleGetStarted}
                        size="lg"
                        className="bg-gradient-primary hover:opacity-90 font-semibold flex items-center gap-3 px-8 py-4 text-lg shadow-lg"
                      >
                        <Plus className="h-5 w-5" />
                        Create Thought
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
