/**
 * Global Loading State Manager
 * Reusable loader for buttons, forms, tables
 */

type LoadingKey = string;

class LoadingManager {
  private loadingStates = new Map<LoadingKey, boolean>();
  private listeners = new Set<() => void>();

  setLoading(key: LoadingKey, isLoading: boolean) {
    this.loadingStates.set(key, isLoading);
    this.notify();
  }

  isLoading(key: LoadingKey): boolean {
    return this.loadingStates.get(key) || false;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }
}

export const loadingManager = new LoadingManager();

// Hook for React components
import { useState, useEffect } from 'react';

export function useLoading(key: LoadingKey): boolean {
  const [isLoading, setIsLoading] = useState(loadingManager.isLoading(key));

  useEffect(() => {
    return loadingManager.subscribe(() => {
      setIsLoading(loadingManager.isLoading(key));
    });
  }, [key]);

  return isLoading;
}

// Utility functions
export function startLoading(key: LoadingKey) {
  loadingManager.setLoading(key, true);
}

export function stopLoading(key: LoadingKey) {
  loadingManager.setLoading(key, false);
}

// Common loading keys
export const LoadingKeys = {
  SIGNUP_CUSTOMER: 'signup-customer',
  SIGNUP_BUSINESS: 'signup-business',
  LOGIN: 'login',
  LOGOUT: 'logout',
  CREATE_ORDER: 'create-order',
  UPDATE_PROFILE: 'update-profile',
  DELETE_MENU_ITEM: 'delete-menu-item',
  UPLOAD_IMAGE: 'upload-image',
} as const;
