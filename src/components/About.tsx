
import { Heart, Users, Shield, Zap } from 'lucide-react';

const About = () => {
  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gradient mb-6">About Think@Friend</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A platform designed for authentic expression and meaningful connections. Share your thoughts about trips, people, and places with complete control over your privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Authentic Expression</h3>
            <p className="text-muted-foreground">
              Share your genuine thoughts and experiences without judgment or algorithms deciding what others see.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real Connections</h3>
            <p className="text-muted-foreground">
              Connect with friends through meaningful mentions and shared experiences, not likes or follower counts.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
            <p className="text-muted-foreground">
              You control who sees what. Keep thoughts private or share publicly - your choice, always.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Features</h3>
            <p className="text-muted-foreground">
              Location verification, user mentions, custom categories, and organized thought history.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-gradient-card rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Built for GenZ, By GenZ</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We understand that social media shouldn't be about performing for others. 
            Think@Friend is about real thoughts, real experiences, and real connections. 
            No algorithms, no ads, no fake engagement - just authentic human expression.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
