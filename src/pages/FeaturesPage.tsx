
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  Globe, 
  Search, 
  Users, 
  Star, 
  Camera, 
  MapPin, 
  MessageSquare,
  UserPlus,
  Hash,
  AtSign,
  Shield
} from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Multi-Type Thoughts",
      description: "Create thoughts about trips, people, places, or anything else that matters to you",
      details: ["Trip memories and experiences", "Thoughts about people you've met", "Special places and locations", "Custom categories for any topic"]
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Privacy Control",
      description: "Complete control over who sees your thoughts with flexible privacy settings",
      details: ["Private thoughts visible only to you", "Public thoughts visible to everyone", "Thoughts about people default to private", "Smart privacy rules for mentioned users"]
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Image Attachments",
      description: "Enhance your thoughts with photos and visual memories",
      details: ["Upload multiple images per thought", "Secure cloud storage", "Image optimization", "Visual storytelling support"]
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Powerful Search",
      description: "Find thoughts, places, and users with intelligent search capabilities",
      details: ["Search by keywords", "Find thoughts by location", "Discover users by username", "Filter by content type"],
      authRequired: true
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Social Following",
      description: "Follow interesting users to stay updated with their public thoughts",
      details: ["Follow/unfollow system", "View follower counts", "Discover through connections", "Build your network"],
      authRequired: true
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Profile Bookmarking",
      description: "Star profiles to bookmark users for easy access later",
      details: ["One-click profile bookmarking", "Organize your favorite users", "Quick access to starred profiles", "Personal curation system"],
      authRequired: true
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location Tagging",
      description: "Tag your thoughts with locations to create geographic memories",
      details: ["Add location to any thought", "Location verification", "Search thoughts by place", "Geographic discovery"]
    },
    {
      icon: <Hash className="h-6 w-6" />,
      title: "Hashtag System",
      description: "Organize and discover content using hashtags and tags",
      details: ["Custom hashtags", "Tag-based discovery", "Trending topics", "Content organization"]
    },
    {
      icon: <AtSign className="h-6 w-6" />,
      title: "User Mentions",
      description: "Mention other registered users in your thoughts",
      details: ["@username mentions", "Notification system", "Connect with mentioned users", "Social interaction"]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Authentication",
      description: "Multiple sign-in options with robust security",
      details: ["Email or username login", "Secure password protection", "Session management", "Account verification"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gradient mb-4">
                Powerful Features
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to share, discover, and connect through authentic thoughts and experiences
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-gradient-card border-border hover-lift transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {feature.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        {feature.authRequired && (
                          <Badge variant="secondary" className="text-xs">
                            Login Required
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* How Privacy Works */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Shield className="h-6 w-6 text-blue-500" />
                  How Privacy Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold">Private Thoughts</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground pl-8">
                      <li>• Only visible to you</li>
                      <li>• Not searchable by others</li>
                      <li>• Don't appear on your public profile</li>
                      <li>• Perfect for personal reflections</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-green-500" />
                      <h3 className="font-semibold">Public Thoughts</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground pl-8">
                      <li>• Visible to everyone</li>
                      <li>• Searchable by keywords and location</li>
                      <li>• Appear on your public profile</li>
                      <li>• Help you connect with others</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Special Rule: Thoughts About People
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Thoughts about people are always private by default to protect privacy. However, if you mention 
                    another registered user with @username in your thought, they will be able to see it regardless 
                    of the privacy setting.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl">Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">1️⃣</span>
                    </div>
                    <h3 className="font-semibold mb-2">Sign Up</h3>
                    <p className="text-sm text-muted-foreground">
                      Create your account with email and username
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">2️⃣</span>
                    </div>
                    <h3 className="font-semibold mb-2">Create Thoughts</h3>
                    <p className="text-sm text-muted-foreground">
                      Share your experiences about trips, people, and places
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">3️⃣</span>
                    </div>
                    <h3 className="font-semibold mb-2">Discover</h3>
                    <p className="text-sm text-muted-foreground">
                      Search for interesting thoughts and users
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">4️⃣</span>
                    </div>
                    <h3 className="font-semibold mb-2">Connect</h3>
                    <p className="text-sm text-muted-foreground">
                      Follow users and bookmark interesting profiles
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
