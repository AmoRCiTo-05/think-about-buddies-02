
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AutocompleteItem {
  id: string;
  type: 'user' | 'location';
  display: string;
  username?: string;
  location?: string;
}

interface SearchWithAutocompleteProps {
  onSearch: (term: string, type: 'thoughts' | 'users') => void;
  searchType: 'thoughts' | 'users';
  onSearchTypeChange: (type: 'thoughts' | 'users') => void;
  isSearching: boolean;
}

const SearchWithAutocomplete = ({ 
  onSearch, 
  searchType, 
  onSearchTypeChange, 
  isSearching 
}: SearchWithAutocompleteProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Clear suggestions when search type changes
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchTerm('');
  }, [searchType]);

  useEffect(() => {
    // Debounced autocomplete
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchTerm.trim().length > 1) {
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(searchTerm.trim());
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, searchType]);

  const fetchSuggestions = async (term: string) => {
    if (!user) return;

    setIsLoadingSuggestions(true);
    try {
      let suggestions: AutocompleteItem[] = [];

      if (searchType === 'users') {
        // Search for users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('user_id, username, full_name')
          .or(`username.ilike.%${term}%,full_name.ilike.%${term}%`)
          .limit(5);

        if (usersError) throw usersError;

        suggestions = usersData?.map(user => ({
          id: user.user_id,
          type: 'user' as const,
          display: `@${user.username}${user.full_name ? ` (${user.full_name})` : ''}`,
          username: user.username
        })) || [];
      } else {
        // Search for locations and users for thoughts
        const [usersResponse, locationsResponse] = await Promise.all([
          supabase
            .from('profiles')
            .select('user_id, username, full_name')
            .or(`username.ilike.%${term}%,full_name.ilike.%${term}%`)
            .limit(3),
          supabase
            .from('thoughts')
            .select('location')
            .not('location', 'is', null)
            .ilike('location', `%${term}%`)
            .limit(3)
        ]);

        const userSuggestions = usersResponse.data?.map(user => ({
          id: user.user_id,
          type: 'user' as const,
          display: `@${user.username}${user.full_name ? ` (${user.full_name})` : ''}`,
          username: user.username
        })) || [];

        const locationSuggestions = Array.from(
          new Set(locationsResponse.data?.map(t => t.location).filter(Boolean))
        ).map((location, index) => ({
          id: `location-${index}`,
          type: 'location' as const,
          display: location!,
          location: location!
        }));

        suggestions = [...userSuggestions, ...locationSuggestions];
      }

      setSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: AutocompleteItem) => {
    if (suggestion.type === 'user') {
      if (searchType === 'users') {
        // Navigate directly to user profile
        navigate(`/profile/${suggestion.username}`);
      } else {
        // Set search term to username for thought search
        setSearchTerm(`@${suggestion.username}`);
        setShowSuggestions(false);
        onSearch(`@${suggestion.username}`, 'thoughts');
      }
    } else if (suggestion.type === 'location') {
      setSearchTerm(suggestion.location!);
      setShowSuggestions(false);
      onSearch(suggestion.location!, 'thoughts');
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (!user) {
      toast.error('Please sign in to search');
      navigate('/auth');
      return;
    }

    setShowSuggestions(false);
    onSearch(searchTerm.trim(), searchType);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative">
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <Button
            variant={searchType === 'thoughts' ? 'default' : 'outline'}
            onClick={() => onSearchTypeChange('thoughts')}
            size="sm"
          >
            Search Thoughts
          </Button>
          <Button
            variant={searchType === 'users' ? 'default' : 'outline'}
            onClick={() => onSearchTypeChange('users')}
            size="sm"
          >
            Search Users
          </Button>
        </div>
        
        <div className="flex gap-2 relative">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder={
                searchType === 'thoughts' 
                  ? "Search by keywords, places, or users..." 
                  : "Search users by username or name..."
              }
              value={searchTerm}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              className="pr-8"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-gradient-primary hover:opacity-90"
          >
            {isSearching ? 'Searching...' : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {!user && (
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to search for thoughts and users
          </p>
        )}
      </div>

      {/* Autocomplete suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            {isLoadingSuggestions && (
              <div className="p-3 text-center text-sm text-muted-foreground">
                Loading suggestions...
              </div>
            )}
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center gap-2 p-3 hover:bg-secondary cursor-pointer border-b border-border last:border-b-0"
              >
                {suggestion.type === 'user' ? (
                  <User className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">{suggestion.display}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchWithAutocomplete;
