import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Account {
  id: number;
  name: string;
  code: string;
  type: string;
  sub_type?: string;
}

interface UseAccountSearchReturn {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchAccounts: (search: string) => Promise<void>;
}

/**
 * Custom hook for searching accounts with debouncing
 * 
 * Provides server-side account search functionality with:
 * - Automatic debouncing (300ms delay)
 * - Loading states
 * - Error handling
 * - Search by name or code
 * 
 * @example
 * const { accounts, loading, searchTerm, setSearchTerm } = useAccountSearch();
 * 
 * // In component:
 * <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
 * {loading && <Spinner />}
 * {accounts.map(account => <div key={account.id}>{account.name}</div>)}
 */
export function useAccountSearch(): UseAccountSearchReturn {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Fetch accounts from the API
   */
  const fetchAccounts = useCallback(async (search: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/accounts-api/search', {
        params: { search },
      });

      setAccounts(response.data.accounts || []);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError('Failed to fetch accounts');
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Debounce search term changes
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAccounts(searchTerm);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    fetchAccounts,
  };
}

