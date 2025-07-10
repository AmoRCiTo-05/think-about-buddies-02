
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Users, Globe } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gradient mb-4">
                About Think@Friend
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A platform dedicated to authentic expression and meaningful connections through shared experiences
              </p>
            </div>

            {/* Mission Section */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Heart className="h-6 w-6 text-red-500" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="text-lg">
                <p className="mb-4">
                  Think@Friend was created to provide a safe space where people can share their authentic thoughts 
                  and experiences about the places they've been, the people they've met, and the journeys they've taken.
                </p>
                <p>
                  We believe that every experience has value and every story deserves to be heard, whether it's 
                  shared publicly with the world or kept private for personal reflection.
                </p>
              </CardContent>
            </Card>

            {/* Values Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Privacy First
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Your thoughts are yours to control. Choose what to share publicly and what to keep private. 
                    We respect your privacy and give you complete control over your content.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500" />
                    Authentic Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Connect with like-minded individuals who share similar interests and experiences. 
                    Build meaningful relationships based on genuine shared moments and stories.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-500" />
                    Global Perspectives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Discover thoughts and experiences from people around the world. Learn about different 
                    cultures, places, and perspectives through authentic personal stories.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-500" />
                    Meaningful Connections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Follow users whose thoughts resonate with you, bookmark profiles for easy access, 
                    and build a network of connections based on shared experiences and interests.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* How It Works Section */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl">How Think@Friend Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">✍️</span>
                    </div>
                    <h3 className="font-semibold mb-2">Share Your Thoughts</h3>
                    <p className="text-sm text-muted-foreground">
                      Create thoughts about trips, people, or places with complete privacy control
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <h3 className="font-semibold mb-2">Discover & Connect</h3>
                    <p className="text-sm text-muted-foreground">
                      Search for public thoughts by keywords, places, or users to find relevant content
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <h3 className="font-semibold mb-2">Build Relationships</h3>
                    <p className="text-sm text-muted-foreground">
                      Follow interesting users and bookmark profiles to stay connected with your community
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Safety */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl">Privacy & Safety</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p><strong>Private by Default:</strong> All thoughts are private unless you choose to make them public</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p><strong>Controlled Sharing:</strong> Thoughts about people remain private unless you mention registered users</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p><strong>Secure Authentication:</strong> Your account is protected with secure login using email or username</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p><strong>User Control:</strong> You have complete control over who can see your content and when</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
