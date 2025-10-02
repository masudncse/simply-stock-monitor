import { useState, useEffect } from 'react';

interface QueuedProduct {
  id: number;
  sku: string;
  name: string;
  price: number;
  barcode?: string;
  quantity: number;
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

  const addToQueue = (product: Omit<QueuedProduct, 'quantity'>) => {
    setQueue((prev) => {
      // Check if product already exists
      if (prev.some((p) => p.id === product.id)) {
        return prev;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setQueue((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: Math.max(1, quantity) } : p
      )
    );
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

  const getQueueWithQuantities = () => {
    return queue.map((p) => ({ id: p.id, quantity: p.quantity }));
  };

  const getTotalLabels = () => {
    return queue.reduce((sum, p) => sum + p.quantity, 0);
  };

  return {
    queue,
    addToQueue,
    updateQuantity,
    removeFromQueue,
    clearQueue,
    isInQueue,
    getQueueIds,
    getQueueWithQuantities,
    queueCount: queue.length,
    getTotalLabels,
  };
}

