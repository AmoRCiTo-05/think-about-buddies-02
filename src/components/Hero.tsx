

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Hero = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleGetStarted = () => {
    if (!loading) {
      if (user) {
        navigate('/create');
      } else {
        navigate('/auth');
      }
    }
  };

  const handleLearnMore = () => {
    navigate('/about');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center max-w-7xl mx-auto">
          {/* Left side - 40% (2/5) */}
          <div className="lg:col-span-2 text-center lg:text-left">
            <div className="mb-8 animate-scale-in">
              <div className="inline-flex items-center gap-2 bg-gradient-card px-4 py-2 rounded-full border border-border mb-6">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium">Organize your thoughts</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
              <span className="text-gradient">Think@Friend</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in max-w-lg mx-auto lg:mx-0 leading-relaxed">
              A platform for authentic expression. Share thoughts about trips, people, and places with complete privacy control. Connect with like-minded individuals and build meaningful relationships.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in">
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 transition-all duration-300 transform hover:scale-105 animate-glow"
                disabled={loading}
              >
                {loading ? 'Loading...' : (user ? 'Create Thought' : 'Get Started')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleLearnMore}
                className="border-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right side - 60% (3/5) */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Floating box that appears cut off on the right */}
              <div className="bg-gradient-card border border-border rounded-2xl p-8 md:p-12 shadow-2xl transform hover:scale-105 transition-all duration-300 animate-scale-in max-w-md lg:max-w-lg relative overflow-hidden">
                {/* Cut-off effect on the right */}
                <div className="absolute -right-8 top-0 bottom-0 w-16 bg-gradient-to-l from-background/80 to-transparent pointer-events-none lg:block hidden"></div>
                
                <div className="text-center relative z-10">
                  <div className="text-6xl md:text-8xl mb-6 animate-bounce">
                    😊
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gradient">
                    Share Your Thoughts
                  </h2>
                  
                  <p className="text-muted-foreground mb-8 text-base md:text-lg">
                    Express yourself authentically and connect with others who share your interests and experiences.
                  </p>
                  
                  <Button 
                    onClick={handleGetStarted}
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 transition-all duration-300 w-full"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : (user ? 'Start Writing' : 'Join Now')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-primary/30 rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-12 w-2 h-2 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-6 left-8 w-4 h-4 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

