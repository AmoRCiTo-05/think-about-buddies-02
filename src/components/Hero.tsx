
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
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
    <div className="pt-24 pb-16 px-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center min-h-[60vh]">
          {/* Left Side - 40% */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit px-4 py-2 text-sm font-medium">
                organize your thoughts
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-gradient">
                Think@Friend
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
                className="bg-gradient-primary hover:opacity-90 font-semibold px-8 py-3"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/about')}
                className="font-semibold px-8 py-3"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Side - 60% with floating box */}
          <div className="lg:col-span-3 relative">
            <div className="relative overflow-hidden">
              <Card className="bg-gradient-card border-border shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300 ml-8 mr-[-2rem] lg:mr-[-4rem]">
                <CardContent className="p-8 text-center">
                  <div className="space-y-6">
                    <div className="text-8xl mb-4">
                      😊
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gradient">
                        Share Your Thoughts
                      </h3>
                      <p className="text-muted-foreground">
                        Join thousands sharing their authentic experiences
                      </p>
                      <Button 
                        onClick={handleGetStarted}
                        className="bg-gradient-primary hover:opacity-90 font-semibold flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
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
