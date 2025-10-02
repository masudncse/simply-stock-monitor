import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Courier {
  id: number;
  name: string;
  code?: string;
  phone?: string;
  email?: string;
  base_rate: number;
  per_kg_rate: number;
  is_active: boolean;
}

export function useCourierSearch() {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCouriers = useCallback(async (search: string) => {
    setLoading(true);
    try {
      const response = await axios.get('/couriers-api/active', {
        params: { search }
      });
      setCouriers(response.data);
    } catch (error) {
      console.error('Error fetching couriers:', error);
      setCouriers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCouriers(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchCouriers]);

  return {
    couriers,
    loading,
    searchTerm,
    setSearchTerm,
    fetchCouriers,
  };
}

