import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Supplier {
  id: number;
  name: string;
  code: string;
  email?: string;
  phone?: string;
}

interface UseSupplierSearchReturn {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchSuppliers: (search: string) => Promise<void>;
}

/**
 * Custom hook for searching suppliers with debouncing
 * 
 * Provides server-side supplier search functionality with:
 * - Automatic debouncing (300ms delay)
 * - Loading states
 * - Error handling
 * - Search by name, code, or email
 * 
 * @example
 * const { suppliers, loading, searchTerm, setSearchTerm } = useSupplierSearch();
 * 
 * // In component:
 * <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
 * {loading && <Spinner />}
 * {suppliers.map(supplier => <div key={supplier.id}>{supplier.name}</div>)}
 */
export function useSupplierSearch(): UseSupplierSearchReturn {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Fetch suppliers from the API
   */
  const fetchSuppliers = useCallback(async (search: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/suppliers-api/search', {
        params: { search },
      });

      setSuppliers(response.data.suppliers || []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Failed to fetch suppliers');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Debounce search term changes
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuppliers(searchTerm);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchSuppliers]);

  return {
    suppliers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    fetchSuppliers,
  };
}

