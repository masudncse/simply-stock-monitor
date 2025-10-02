import { useState, useEffect } from 'react';

interface QueuedProduct {
  id: number;
  sku: string;
  name: string;
  price: number;
  barcode?: string;
}

const STORAGE_KEY = 'barcode_print_queue';

export function useBarcodeQueue() {
  const [queue, setQueue] = useState<QueuedProduct[]>([]);

  // Load queue from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setQueue(parsed);
      } catch (error) {
        console.error('Failed to parse barcode queue:', error);
      }
    }
  }, []);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  }, [queue]);

  const addToQueue = (product: QueuedProduct) => {
    setQueue((prev) => {
      // Check if product already exists
      if (prev.some((p) => p.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromQueue = (productId: number) => {
    setQueue((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearQueue = () => {
    setQueue([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isInQueue = (productId: number) => {
    return queue.some((p) => p.id === productId);
  };

  const getQueueIds = () => {
    return queue.map((p) => p.id);
  };

  return {
    queue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    isInQueue,
    getQueueIds,
    queueCount: queue.length,
  };
}

