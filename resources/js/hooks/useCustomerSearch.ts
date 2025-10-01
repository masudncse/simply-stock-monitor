import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Customer {
  id: number;
  name: string;
  code: string;
  email?: string;
  phone?: string;
}

interface UseCustomerSearchReturn {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchCustomers: (search: string) => Promise<void>;
}

/**
 * Custom hook for searching customers with debouncing
 * 
 * Provides server-side customer search functionality with:
 * - Automatic debouncing (300ms delay)
 * - Loading states
 * - Error handling
 * - Search by name, code, or email
 * 
 * @example
 * const { customers, loading, searchTerm, setSearchTerm } = useCustomerSearch();
 * 
 * // In component:
 * <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
 * {loading && <Spinner />}
 * {customers.map(customer => <div key={customer.id}>{customer.name}</div>)}
 */
export function useCustomerSearch(): UseCustomerSearchReturn {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Fetch customers from the API
   */
  const fetchCustomers = useCallback(async (search: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/customers-api/search', {
        params: { search },
      });

      setCustomers(response.data.customers || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to fetch customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Debounce search term changes
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCustomers(searchTerm);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchCustomers]);

  return {
    customers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    fetchCustomers,
  };
}

