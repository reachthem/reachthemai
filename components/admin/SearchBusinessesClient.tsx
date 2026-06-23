'use client';

import { useState, useCallback, useEffect } from 'react';
import { Search, MapPin, Star, Loader2, ChevronLeft, Check, List, X } from 'lucide-react';
import { toast } from 'sonner';
import { saveContacts, getSavedPlaceIds, getSavedContactIdsByPlaceIds } from '@/app/actions/contacts';
import { getContactListsWithCounts, assignContactsToList } from '@/app/actions/contact-lists';

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

const PAGE_SIZE = 20;

export default function SearchBusinessesClient() {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastQuery, setLastQuery] = useState('');
  const [lastZip, setLastZip] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [savedPlaceIds, setSavedPlaceIds] = useState<Set<string>>(new Set());
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [lists, setLists] = useState<{ id: string; name: string; contactCount: number }[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [loadingLists, setLoadingLists] = useState(false);

  const buildQuery = () => {
    const parts: string[] = [];
    if (keyword.trim()) parts.push(keyword.trim());
    const location = [city.trim(), state.trim(), zip.trim()].filter(Boolean).join(', ');
    if (location) parts.push(location);
    return parts.join(' ').trim();
  };

  const fetchPlaces = async (q: string, pageToken?: string | null, zipCode?: string) => {
    const url = new URL('/api/scanner/places', window.location.origin);
    url.searchParams.set('q', q);
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    if (zipCode?.trim()) url.searchParams.set('zip', zipCode.trim());
    const res = await fetch(url.toString());
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Search failed');
    return { places: data.places ?? [], nextPageToken: data.nextPageToken ?? null };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const q = buildQuery();
    if (q.length < 2) {
      setError('Enter at least 2 characters (keyword and/or location).');
      setResults([]);
      setSearched(true);
      setNextPageToken(null);
      setCurrentPage(1);
      return;
    }

    setIsSearching(true);
    setSearched(true);
    setLastQuery(q);
    setLastZip(zip.trim());
    setCurrentPage(1);
    setSelectedIds(new Set());
    try {
      const { places, nextPageToken: token } = await fetchPlaces(q, undefined, zip.trim() || undefined);
      setResults(places);
      setNextPageToken(token);
      setError(null);
      const ids = await getSavedPlaceIds(places.map((p: PlaceResult) => p.placeId));
      setSavedPlaceIds(new Set(ids));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
      setResults([]);
      setNextPageToken(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleNextPage = async () => {
    if (!nextPageToken || !lastQuery) return;
    setIsSearching(true);
    setError(null);
    setSelectedIds(new Set());
    try {
      const { places, nextPageToken: token } = await fetchPlaces(lastQuery, nextPageToken, lastZip || undefined);
      setResults(places);
      setNextPageToken(token);
      setCurrentPage((p) => p + 1);
      const ids = await getSavedPlaceIds(places.map((p: PlaceResult) => p.placeId));
      setSavedPlaceIds(new Set(ids));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load next page.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePrevPage = async () => {
    if (currentPage <= 1 || !lastQuery) return;
    setIsSearching(true);
    setError(null);
    setSelectedIds(new Set());
    try {
      const { places, nextPageToken: token } = await fetchPlaces(lastQuery, undefined, lastZip || undefined);
      setResults(places);
      setNextPageToken(token);
      setCurrentPage(1);
      const ids = await getSavedPlaceIds(places.map((p: PlaceResult) => p.placeId));
      setSavedPlaceIds(new Set(ids));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load previous page.');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = results.length > 0 && selectedIds.size === results.length;
  const handleSelectAll = useCallback(() => {
    if (selectAll) setSelectedIds(new Set());
    else setSelectedIds(new Set(results.map((p) => p.placeId)));
  }, [selectAll, results]);

  const openSaveModal = useCallback(() => {
    if (selectedIds.size === 0 || saving) return;
    setSaveModalOpen(true);
    setSelectedListId(null);
  }, [selectedIds, saving]);

  useEffect(() => {
    if (!saveModalOpen) return;
    setLoadingLists(true);
    getContactListsWithCounts()
      .then((data) => setLists(data ?? []))
      .catch(() => toast.error('Failed to load lists'))
      .finally(() => setLoadingLists(false));
  }, [saveModalOpen]);

  const handleSaveContactsToList = useCallback(async () => {
    if (!selectedListId || selectedIds.size === 0 || saving) return;
    const toSave = results.filter((p) => selectedIds.has(p.placeId));
    setSaving(true);
    try {
      const out = await saveContacts(toSave);
      if (out.error) {
        toast.error(out.error);
        return;
      }
      const placeIds = toSave.map((p) => p.placeId);
      const savedContacts = await getSavedContactIdsByPlaceIds(placeIds);
      const ids = savedContacts.map((c) => c.id);
      if (ids.length > 0) {
        await assignContactsToList(ids, selectedListId);
      }
      toast.success(
        out.saved > 0
          ? `Saved ${out.saved} contact(s) to list${out.duplicates > 0 ? ` (${out.duplicates} already saved)` : ''}.`
          : 'Contacts added to list.'
      );
      setSavedPlaceIds((saved) => new Set([...saved, ...placeIds]));
      setSelectedIds(new Set());
      setSaveModalOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save contacts');
    } finally {
      setSaving(false);
    }
  }, [selectedListId, selectedIds, results, saving]);

  const inputClass =
    'block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-[#f8fafc] dark:bg-slate-800';

  return (
    <>
      <div className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="keyword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Keyword
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="keyword"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. pizza, plumber"
                  className={`pl-9 pr-3 ${inputClass}`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                City
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                State
              </label>
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Zip code
              </label>
              <input
                id="zip"
                type="text"
                inputMode="numeric"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Zip code"
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white text-sm font-medium rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching…
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Search
              </>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {searched && !isSearching && !error && results.length === 0 && (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <MapPin className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            No businesses found. Try a different keyword or location.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
              {selectAll ? 'Deselect all' : 'Select all'}
            </button>
            <button
              type="button"
              onClick={openSaveModal}
              disabled={selectedIds.size === 0 || saving}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none text-white text-sm font-medium"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Save {selectedIds.size > 0 ? `${selectedIds.size} ` : ''}contact(s)
            </button>
          </div>

          {/* Save to list modal */}
          {saveModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !saving && setSaveModalOpen(false)}>
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Save to list</h3>
                  <button type="button" onClick={() => !saving && setSaveModalOpen(false)} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Choose a list to save {selectedIds.size} contact(s) into.
                </p>
                {loadingLists ? (
                  <div className="flex items-center gap-2 text-slate-500 py-4">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading lists…
                  </div>
                ) : lists.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4">No lists yet. Create one from the list management page.</p>
                ) : (
                  <ul className="space-y-2 max-h-48 overflow-y-auto mb-4">
                    {lists.map((list) => (
                      <li key={list.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedListId(list.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            selectedListId === list.id
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {list.name} <span className="text-slate-500 font-normal">({list.contactCount})</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap gap-2">
                  <a
                    href="/app/contact-lists"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <List className="h-4 w-4" /> Manage Lists
                  </a>
                  <button
                    type="button"
                    onClick={handleSaveContactsToList}
                    disabled={!selectedListId || saving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-medium"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Save to list
                  </button>
                </div>
              </div>
            </div>
          )}
          <ul className="space-y-3">
            {results.map((place) => {
              const isSaved = savedPlaceIds.has(place.placeId);
              return (
              <li
                key={place.placeId}
                className={`relative p-4 pl-10 rounded-xl border bg-white dark:bg-slate-800/50 transition-colors ${
                  isSaved
                    ? 'border-green-500 dark:border-green-600 hover:border-green-600 dark:hover:border-green-500'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800'
                }`}
              >
                {isSaved && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/40 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                    <Check className="h-3.5 w-3.5" />
                    Saved
                  </span>
                )}
                <div className="absolute left-3 top-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(place.placeId)}
                    onChange={() => toggleSelect(place.placeId)}
                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {place.name}
                    </p>
                    {place.address && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {place.address}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {place.rating != null && (
                        <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          {place.rating}
                        </span>
                      )}
                      {place.totalReviews != null && (
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {place.totalReviews.toLocaleString()} reviews
                        </span>
                      )}
                      {place.primaryType && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                          {place.primaryType}
                        </span>
                      )}
                    </div>
                    {place.phone && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {place.phone}
                      </p>
                    )}
                  </div>
                  {place.mapsUrl && (
                    <a
                      href={place.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-full sm:w-auto inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      View Profile
                    </a>
                  )}
                </div>
              </li>
            );
            })}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Page {currentPage}
              {results.length === PAGE_SIZE && nextPageToken && (
                <span className="text-slate-400"> · Up to {PAGE_SIZE} per page</span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage <= 1 || isSearching}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={!nextPageToken || isSearching}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary-600 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50 disabled:pointer-events-none"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
