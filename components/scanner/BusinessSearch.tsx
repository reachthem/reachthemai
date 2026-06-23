'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, MapPin, Star, Loader2 } from 'lucide-react';

interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  rating: number | null;
  totalReviews: number | null;
  primaryType: string | null;
  phone: string | null;
  website: string | null;
  mapsUrl: string | null;
}

interface BusinessSearchProps {
  onSelect: (place: PlaceResult) => void;
  disabled?: boolean;
  placesApiUrl?: string;
}

export default function BusinessSearch({ onSelect, disabled, placesApiUrl = '/api/scanner/places' }: BusinessSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchPlaces = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`${placesApiUrl}?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.places ?? []);
        setShowDropdown(true);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  }, [placesApiUrl]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPlaces(value), 400);
  };

  const handleSelect = (place: PlaceResult) => {
    setQuery(place.name);
    setShowDropdown(false);
    onSelect(place);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Search for your business on Google..."
          disabled={disabled}
          className="w-full pl-12 pr-12 py-4 rounded-xl border border-secondary-200 bg-white text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-500 animate-spin" />
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-secondary-200 rounded-xl shadow-lg overflow-hidden max-h-96 overflow-y-auto">
          {results.map((place) => (
            <button
              key={place.placeId}
              onClick={() => handleSelect(place)}
              className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors border-b border-secondary-100 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-secondary-900 truncate">{place.name}</p>
                  <p className="text-sm text-secondary-500 truncate">{place.address}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {place.rating && (
                      <span className="flex items-center gap-1 text-sm text-secondary-600">
                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                        {place.rating}
                      </span>
                    )}
                    {place.totalReviews != null && (
                      <span className="text-sm text-secondary-500">
                        {place.totalReviews.toLocaleString()} reviews
                      </span>
                    )}
                    {place.primaryType && (
                      <span className="text-xs text-secondary-400 bg-secondary-100 px-2 py-0.5 rounded-full">
                        {place.primaryType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown && results.length === 0 && !isSearching && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-secondary-200 rounded-xl shadow-lg p-6 text-center">
          <p className="text-secondary-500">No businesses found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
