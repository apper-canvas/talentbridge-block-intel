import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const SearchBar = ({ onSearch, placeholder = "Search jobs, companies, or skills...", className = '', debounceMs = 300 }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) return;
    
    const timeoutId = setTimeout(() => {
      setIsSearching(false);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      return; // Prevent empty searches
    }
    
    setIsSearching(true);
    onSearch(trimmedQuery);
    
    // Reset searching state after a short delay
    setTimeout(() => setIsSearching(false), 500);
  }, [query, onSearch]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      setIsSearching(true);
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 w-full ${className}`}>
      <div className="flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          icon="Search"
          className="w-full"
        />
      </div>
      <Button 
        type="submit" 
        variant="primary"
        disabled={!query.trim() || isSearching}
        className="shrink-0 px-4 py-2 text-sm"
      >
        {isSearching ? 'Searching...' : 'Search'}
      </Button>
    </form>
  );
};

export default SearchBar;