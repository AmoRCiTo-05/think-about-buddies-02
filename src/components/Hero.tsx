
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

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8 animate-scale-in">
            <div className="inline-flex items-center gap-2 bg-gradient-card px-4 py-2 rounded-full border border-border mb-6">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">Share Your Authentic Thoughts</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            <span className="text-gradient">Think@Friend</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in max-w-2xl mx-auto">
            A platform for authentic expression. Share thoughts about trips, people, and places with complete privacy control.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
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
              onClick={() => navigate('/auth')}
              className="border-primary/20 hover:border-primary/40 transition-all duration-300"
            >
              {user ? 'Profile' : 'Sign In'}
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in">
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">✈️</span>
              </div>
              <h3 className="font-semibold mb-2">Travel Memories</h3>
              <p className="text-sm text-muted-foreground">Document your journeys and adventures</p>
            </div>
            
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-semibold mb-2">People Stories</h3>
              <p className="text-sm text-muted-foreground">Share thoughts about meaningful connections</p>
            </div>
            
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="font-semibold mb-2">Special Places</h3>
              <p className="text-sm text-muted-foreground">Capture the essence of locations that matter</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
