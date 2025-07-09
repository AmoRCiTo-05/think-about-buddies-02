
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Rocket, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const CreateThought = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-8 animate-slide-up">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-card rounded-full px-6 py-3 border border-border">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm font-medium">Time to spill the tea ☕</span>
              </div>
              
              <h1 className="text-4xl md:text-7xl font-bold leading-tight">
                <span className="text-gradient">What's on</span><br />
                <span className="text-foreground">your mind?</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Whether it's about that amazing trip, your squad, or that place that hits different - 
                let's capture those thoughts that matter! ✨
              </p>
            </div>

            {/* Main Card */}
            <div className="bg-gradient-card rounded-3xl p-8 md:p-12 border border-border backdrop-blur-sm max-w-4xl mx-auto">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center">Ready to start?</h2>
                
                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl">
                        <Rocket className="h-8 w-8 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Quick & Easy</h3>
                        <p className="text-muted-foreground">Just a few steps to share your thoughts and make them count</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl p-6 border border-purple-500/20">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-2xl">
                        <Shield className="h-8 w-8 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Your Choice</h3>
                        <p className="text-muted-foreground">Keep it private or share with the world - you decide who sees what</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20">
                    <div className="text-center space-y-2">
                      <p className="text-lg font-medium">🔥 Join thousands sharing their real thoughts</p>
                      <p className="text-muted-foreground">Authentic experiences, honest opinions, genuine connections</p>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    onClick={() => navigate('/type')}
                    className="w-full bg-gradient-primary hover:opacity-90 transition-all group py-4 text-lg font-semibold rounded-2xl"
                  >
                    Let's Go! 
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
              <div className="text-center space-y-2">
                <div className="text-2xl">⚡</div>
                <h4 className="font-semibold">Lightning Fast</h4>
                <p className="text-sm text-muted-foreground">Create and share in under 5 minutes</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-2xl">🎯</div>
                <h4 className="font-semibold">Totally Honest</h4>
                <p className="text-sm text-muted-foreground">Real thoughts, real experiences</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-2xl">🌟</div>
                <h4 className="font-semibold">Your Vibe</h4>
                <p className="text-sm text-muted-foreground">Express yourself authentically</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateThought;
