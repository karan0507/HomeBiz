"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

/**
 * Route Guard for authenticated routes
 * Redirects to login if not authenticated
 */
export function useAuthGuard(redirectTo: string = '/login') {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      console.warn('[Route Guard] Unauthorized access, redirecting to', redirectTo);
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  return isAuthenticated;
}

/**
 * Route Guard for customer-only routes
 * Redirects to login or error page if not customer
 */
export function useCustomerGuard() {
  const { isAuthenticated, isCustomer } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      console.warn('[Route Guard] Not authenticated, redirecting to /login');
      router.push('/login');
    } else if (!isCustomer) {
      console.warn('[Route Guard] Not a customer, access denied');
      router.push('/');
    }
  }, [isAuthenticated, isCustomer, router]);

  return isAuthenticated && isCustomer;
}

/**
 * Route Guard for business-only routes
 * Redirects to login or error page if not business
 */
export function useBusinessGuard() {
  const { isAuthenticated, isBusiness } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      console.warn('[Route Guard] Not authenticated, redirecting to /business/login');
      router.push('/business/login');
    } else if (!isBusiness) {
      console.warn('[Route Guard] Not a business user, access denied');
      router.push('/');
    }
  }, [isAuthenticated, isBusiness, router]);

  return isAuthenticated && isBusiness;
}

/**
 * Route Guard for admin-only routes
 * Redirects to login or error page if not admin
 */
export function useAdminGuard() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      console.warn('[Route Guard] Not authenticated, redirecting to /admin/login');
      router.push('/admin/login');
    } else if (!isAdmin) {
      console.warn('[Route Guard] Not an admin, access denied');
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  return isAuthenticated && isAdmin;
}

/**
 * Route Guard for guest-only routes (login, signup)
 * Redirects to dashboard if already authenticated
 */
export function useGuestGuard(role?: 'customer' | 'business' | 'admin') {
  const { isAuthenticated, isCustomer, isBusiness, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('[Route Guard] Already authenticated, redirecting to dashboard');

      if (isAdmin) {
        router.push('/admin/dashboard');
      } else if (isBusiness) {
        router.push('/business/dashboard');
      } else if (isCustomer) {
        router.push('/account');
      }
    }
  }, [isAuthenticated, isCustomer, isBusiness, isAdmin, router]);

  return !isAuthenticated;
}
