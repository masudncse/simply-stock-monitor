import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  unit: string;
}

interface UseProductSearchReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchProducts: (search: string) => Promise<void>;
}

/**
 * Custom hook for searching products with debouncing
 * 
 * Provides server-side product search functionality with:
 * - Automatic debouncing (300ms delay)
 * - Loading states
 * - Error handling
 * - Search by name, SKU, or barcode
 * 
 * @example
 * const { products, loading, searchTerm, setSearchTerm } = useProductSearch();
 * 
 * // In component:
 * <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
 * {loading && <Spinner />}
 * {products.map(product => <div key={product.id}>{product.name}</div>)}
 */
export function useProductSearch(): UseProductSearchReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Fetch products from the API
   */
  const fetchProducts = useCallback(async (search: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/products-api/search', {
        params: { search },
      });

      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Debounce search term changes
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchProducts]);

  return {
    products,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    fetchProducts,
  };
}

