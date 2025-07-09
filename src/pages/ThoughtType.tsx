
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, MapPin, Users, Plane, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const ThoughtType = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [customType, setCustomType] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const navigate = useNavigate();

  const thoughtTypes = [
    {
      id: 'trip',
      title: 'Trip/Adventure',
      subtitle: 'That epic journey you took',
      icon: Plane,
      emoji: '✈️',
      description: 'Vacations, road trips, or any adventure',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'people',
      title: 'Friends/People',
      subtitle: 'Thoughts about your squad',
      icon: Users,
      emoji: '👥',
      description: 'Friends, family, or people you met',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'place',
      title: 'Places',
      subtitle: 'That spot that hits different',
      icon: MapPin,
      emoji: '📍',
      description: 'Restaurants, hangout spots, or locations',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'experience',
      title: 'Experience/Memory',
      subtitle: 'A moment worth remembering',
      icon: Heart,
      emoji: '💭',
      description: 'Events, experiences, or special moments',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'others',
      title: 'Others',
      subtitle: 'Create your own category',
      icon: Sparkles,
      emoji: '✨',
      description: 'Something unique? Tell us what it is!',
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    if (typeId === 'others') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setCustomType('');
    }
  };

  const handleNext = () => {
    if (selectedType) {
      const finalType = selectedType === 'others' ? customType : selectedType;
      navigate('/privacy', { state: { thoughtType: finalType } });
    }
  };

  const canProceed = selectedType && (selectedType !== 'others' || customType.trim() !== '');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-8 animate-slide-up">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-card rounded-full px-6 py-3 border border-border">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm font-medium">Step 1 of 5</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="text-gradient">Pick your vibe</span> ✨
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                What type of thought are you about to drop? Choose what resonates with you! 🔥
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {thoughtTypes.map((type) => {
                const IconComponent = type.icon;
                const isSelected = selectedType === type.id;
                
                return (
                  <div
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className={`
                      relative overflow-hidden rounded-3xl p-6 border cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl
                      ${isSelected
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                        : 'border-border hover:border-primary/50 bg-gradient-card'
                      }
                    `}
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${type.gradient} opacity-5`}></div>
                    
                    <div className="relative space-y-4">
                      {/* Icon Section */}
                      <div className="flex items-center justify-between">
                        <div className="text-4xl">{type.emoji}</div>
                        <div className={`p-3 rounded-2xl ${isSelected ? 'bg-primary/20' : 'bg-secondary/50'}`}>
                          <IconComponent className={`h-6 w-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold">{type.title}</h3>
                        <p className="text-primary text-sm font-medium">{type.subtitle}</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">{type.description}</p>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="bg-primary/20 rounded-xl p-3 animate-fade-in border border-primary/30">
                          <p className="text-primary text-sm font-medium text-center">
                            Selected! Ready to continue 🚀
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Input for Others */}
            {showCustomInput && (
              <div className="max-w-md mx-auto animate-slide-up">
                <div className="bg-gradient-card rounded-2xl p-6 border border-border">
                  <div className="space-y-4">
                    <Label htmlFor="custom-type" className="text-lg font-semibold flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span>What's your thought about?</span>
                    </Label>
                    <Input
                      id="custom-type"
                      placeholder="e.g., School life, Food, Movies, Relationships..."
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      className="bg-secondary/50 border-border focus:border-primary text-lg py-3"
                    />
                    <p className="text-sm text-muted-foreground">
                      💡 Be creative! This is your space to think about anything
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Continue Button */}
            <div className="text-center pt-4">
              <Button 
                size="lg"
                onClick={handleNext}
                disabled={!canProceed}
                className="bg-gradient-primary hover:opacity-90 transition-all group disabled:opacity-50 px-8 py-4 text-lg font-semibold rounded-2xl"
              >
                Continue to Privacy
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThoughtType;
