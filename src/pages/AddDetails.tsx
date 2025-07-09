
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Users, MapPin, Plus, X, Camera } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';

const AddDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { thoughtType, privacy, location: thoughtLocation } = location.state || {};
  
  const [people, setPeople] = useState<string[]>(['']);
  const [places, setPlaces] = useState<string[]>(['']);
  const [peopleImages, setPeopleImages] = useState<{[key: string]: string[]}>({});
  const [placeImages, setPlaceImages] = useState<{[key: string]: string[]}>({});

  const addPerson = () => {
    setPeople([...people, '']);
  };

  const removePerson = (index: number) => {
    const newPeople = people.filter((_, i) => i !== index);
    setPeople(newPeople);
    // Clean up images for removed person
    const personName = people[index];
    if (personName && peopleImages[personName]) {
      const { [personName]: removed, ...rest } = peopleImages;
      setPeopleImages(rest);
    }
  };

  const updatePerson = (index: number, value: string) => {
    const oldName = people[index];
    const newPeople = [...people];
    newPeople[index] = value;
    setPeople(newPeople);

    // Update images mapping if name changed
    if (oldName && oldName !== value && peopleImages[oldName]) {
      const images = peopleImages[oldName];
      const { [oldName]: removed, ...rest } = peopleImages;
      setPeopleImages({
        ...rest,
        [value]: images
      });
    }
  };

  const addPlace = () => {
    setPlaces([...places, '']);
  };

  const removePlace = (index: number) => {
    const newPlaces = places.filter((_, i) => i !== index);
    setPlaces(newPlaces);
    // Clean up images for removed place
    const placeName = places[index];
    if (placeName && placeImages[placeName]) {
      const { [placeName]: removed, ...rest } = placeImages;
      setPlaceImages(rest);
    }
  };

  const updatePlace = (index: number, value: string) => {
    const oldName = places[index];
    const newPlaces = [...places];
    newPlaces[index] = value;
    setPlaces(newPlaces);

    // Update images mapping if name changed
    if (oldName && oldName !== value && placeImages[oldName]) {
      const images = placeImages[oldName];
      const { [oldName]: removed, ...rest } = placeImages;
      setPlaceImages({
        ...rest,
        [value]: images
      });
    }
  };

  const handlePersonImageUpload = (personName: string, url: string) => {
    setPeopleImages(prev => ({
      ...prev,
      [personName]: [...(prev[personName] || []), url]
    }));
  };

  const handlePersonImageRemove = (personName: string, url: string) => {
    setPeopleImages(prev => ({
      ...prev,
      [personName]: (prev[personName] || []).filter(img => img !== url)
    }));
  };

  const handlePlaceImageUpload = (placeName: string, url: string) => {
    setPlaceImages(prev => ({
      ...prev,
      [placeName]: [...(prev[placeName] || []), url]
    }));
  };

  const handlePlaceImageRemove = (placeName: string, url: string) => {
    setPlaceImages(prev => ({
      ...prev,
      [placeName]: (prev[placeName] || []).filter(img => img !== url)
    }));
  };

  const handleNext = () => {
    const filteredPeople = people.filter(person => person.trim() !== '');
    const filteredPlaces = places.filter(place => place.trim() !== '');
    
    navigate('/write', { 
      state: { 
        thoughtType, 
        privacy, 
        location: thoughtLocation, 
        people: filteredPeople, 
        places: filteredPlaces,
        peopleImages,
        placeImages
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-24 px-4 pb-8">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8 animate-slide-up">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-card rounded-full px-6 py-3 border border-border">
                <Camera className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm font-medium">Step 3 of 5</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="text-gradient">Add the details</span> 📝
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Tell us about the people and places that made this {thoughtType} special. Add photos to make your memories even more vivid! 📸✨
              </p>
            </div>

            {/* People Section */}
            <div className="bg-gradient-card rounded-3xl p-8 border border-border backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-500/20 rounded-2xl">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">👥 People</h3>
                    <p className="text-muted-foreground">Who were you with? Add photos of your squad!</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {people.map((person, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Input
                          placeholder="Enter person's name..."
                          value={person}
                          onChange={(e) => updatePerson(index, e.target.value)}
                          className="flex-1 bg-secondary/50 border-border focus:border-primary"
                        />
                        {people.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removePerson(index)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {person.trim() && (
                        <div className="ml-4 pl-4 border-l-2 border-purple-500/30">
                          <ImageUpload
                            onImageUpload={(url) => handlePersonImageUpload(person, url)}
                            onImageRemove={(url) => handlePersonImageRemove(person, url)}
                            images={peopleImages[person] || []}
                            maxImages={3}
                            title={`Photos of ${person}`}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={addPerson}
                  className="w-full border-purple-500/30 text-purple-500 hover:bg-purple-500/10"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Person
                </Button>
              </div>
            </div>

            {/* Places Section */}
            <div className="bg-gradient-card rounded-3xl p-8 border border-border backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-500/20 rounded-2xl">
                    <MapPin className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">📍 Places</h3>
                    <p className="text-muted-foreground">Which places did you visit? Capture the locations!</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {places.map((place, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Input
                          placeholder="Enter place name..."
                          value={place}
                          onChange={(e) => updatePlace(index, e.target.value)}
                          className="flex-1 bg-secondary/50 border-border focus:border-primary"
                        />
                        {places.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removePlace(index)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {place.trim() && (
                        <div className="ml-4 pl-4 border-l-2 border-green-500/30">
                          <ImageUpload
                            onImageUpload={(url) => handlePlaceImageUpload(place, url)}
                            onImageRemove={(url) => handlePlaceImageRemove(place, url)}
                            images={placeImages[place] || []}
                            maxImages={5}
                            title={`Photos of ${place}`}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={addPlace}
                  className="w-full border-green-500/30 text-green-500 hover:bg-green-500/10"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Place
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/privacy')}
                className="flex-1 border-primary text-primary hover:bg-primary/10 py-3 rounded-xl"
              >
                Back
              </Button>
              
              <Button 
                size="lg"
                onClick={handleNext}
                className="flex-1 bg-gradient-primary hover:opacity-90 transition-all group py-3 rounded-xl"
              >
                Continue to Writing
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDetails;
