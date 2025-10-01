import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
}

interface UseCategorySearchOptions {
  initialSearch?: string;
  autoLoadOnMount?: boolean;
}

interface UseCategorySearchReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchCategories: (search?: string) => Promise<void>;
  clearSearch: () => void;
}

/**
 * Custom hook for searching categories with debounced API calls
 * 
 * @example
 * const { categories, loading, searchTerm, setSearchTerm } = useCategorySearch();
 * 
 * // In your component:
 * <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
 * {loading ? 'Loading...' : categories.map(cat => <div>{cat.name}</div>)}
 */
export function useCategorySearch(options: UseCategorySearchOptions = {}): UseCategorySearchReturn {
  const { initialSearch = '', autoLoadOnMount = false } = options;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const fetchCategories = async (search: string = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/categories-api/search?search=${encodeURIComponent(search)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCategories([]);
  };

  // Debounced search effect (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm || autoLoadOnMount) {
        fetchCategories(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Auto-load on mount if option is enabled
  useEffect(() => {
    if (autoLoadOnMount) {
      fetchCategories(initialSearch);
    }
  }, []);

  return {
    categories,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    fetchCategories,
    clearSearch,
  };
}

