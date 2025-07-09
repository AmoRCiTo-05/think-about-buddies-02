
import { MapPin, Users, Lock, Globe, Tag, Clock, Verified, MessageSquare, Heart, UserPlus, Star, MessageCircle } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Thought Categories",
      description: "Organize thoughts by trips, people, places, or create custom categories that matter to you."
    },
    {
      icon: Lock,
      title: "Privacy Control",
      description: "Every thought can be private or public. You decide who gets to see what you share."
    },
    {
      icon: Users,
      title: "User Mentions",
      description: "Tag friends in your thoughts to share experiences and create meaningful connections."
    },
    {
      icon: MapPin,
      title: "Location Tracking",
      description: "Add locations to your thoughts with automatic verification to ensure authenticity."
    },
    {
      icon: Tag,
      title: "Smart Tagging",
      description: "Use custom tags to organize and find your thoughts easily across different topics."
    },
    {
      icon: Clock,
      title: "Thought History",
      description: "Access your complete thought history with search and filter capabilities."
    },
    {
      icon: Verified,
      title: "Verification System",
      description: "Locations and user mentions are verified to maintain trust and authenticity."
    },
    {
      icon: Globe,
      title: "Public Discovery",
      description: "Discover public thoughts from other users and join conversations that interest you."
    },
    {
      icon: MessageCircle,
      title: "Reply to Thoughts",
      description: "Engage with the community by replying to public thoughts. Only signed-up users can participate in conversations."
    },
    {
      icon: Heart,
      title: "Like Thoughts",
      description: "Show appreciation for thoughts you enjoy. Keep track of your liked thoughts in your profile."
    },
    {
      icon: UserPlus,
      title: "Follow Users",
      description: "Follow interesting users to stay updated with their latest thoughts and experiences."
    },
    {
      icon: Star,
      title: "Bookmark Profiles",
      description: "Star profiles for quick access to users whose thoughts you find valuable or interesting."
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gradient mb-6">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to express yourself authentically and connect meaningfully with others.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-gradient-card rounded-xl p-6 hover-lift transition-all duration-300 border border-border"
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-card rounded-2xl p-8 border border-border">
            <h3 className="text-2xl font-bold mb-4">Coming Soon</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-muted-foreground">
              <div>
                <strong className="text-foreground">AI Insights</strong>
                <p>Smart suggestions for locations and connections</p>
              </div>
              <div>
                <strong className="text-foreground">Group Thoughts</strong>
                <p>Collaborative thinking with friend groups</p>
              </div>
              <div>
                <strong className="text-foreground">Mood Tracking</strong>
                <p>Track how your thoughts and feelings evolve</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
