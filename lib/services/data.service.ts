/**
 * Unified Data Service with Singleton Caching
 * Used for static/low-frequency update data like Cuisines, Dietary Options, and Provinces.
 */

import { getCuisineTypes } from './cuisine-types.service';
import { getDietaryOptions } from './dietary-options.service';
import { getProvinces } from './provinces.service';
import type { CuisineType, DietaryOption, Province } from '@/types/database';

interface CacheStore {
    cuisineTypes: CuisineType[] | null;
    dietaryOptions: DietaryOption[] | null;
    provinces: Province[] | null;
    lastFetched: {
        cuisineTypes: number;
        dietaryOptions: number;
        provinces: number;
    };
}

const CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache

const cache: CacheStore = {
    cuisineTypes: null,
    dietaryOptions: null,
    provinces: null,
    lastFetched: {
        cuisineTypes: 0,
        dietaryOptions: 0,
        provinces: 0,
    },
};

/**
 * Check if cache is valid for a given key
 */
function isCacheValid(key: keyof CacheStore['lastFetched']): boolean {
    return !!cache[key as keyof Omit<CacheStore, 'lastFetched'>] && (Date.now() - cache.lastFetched[key] < CACHE_TTL);
}

/**
 * Get all cuisine types with caching
 */
export async function getCachedCuisineTypes(): Promise<CuisineType[]> {
    if (isCacheValid('cuisineTypes')) {
        return cache.cuisineTypes!;
    }

    const data = await getCuisineTypes();
    cache.cuisineTypes = data;
    cache.lastFetched.cuisineTypes = Date.now();
    return data;
}

/**
 * Get all dietary options with caching
 */
export async function getCachedDietaryOptions(): Promise<DietaryOption[]> {
    if (isCacheValid('dietaryOptions')) {
        return cache.dietaryOptions!;
    }

    const data = await getDietaryOptions();
    cache.dietaryOptions = data;
    cache.lastFetched.dietaryOptions = Date.now();
    return data;
}

/**
 * Get all provinces with caching
 */
export async function getCachedProvinces(): Promise<Province[]> {
    if (isCacheValid('provinces')) {
        return cache.provinces!;
    }

    const data = await getProvinces();
    cache.provinces = data;
    cache.lastFetched.provinces = Date.now();
    return data;
}

/**
 * Force clear cache for specific items
 */
export function clearDataCache(key?: keyof CacheStore['lastFetched']) {
    if (key) {
        cache[key as keyof Omit<CacheStore, 'lastFetched'>] = null;
        cache.lastFetched[key] = 0;
    } else {
        cache.cuisineTypes = null;
        cache.dietaryOptions = null;
        cache.provinces = null;
        Object.keys(cache.lastFetched).forEach(k => {
            cache.lastFetched[k as keyof CacheStore['lastFetched']] = 0;
        });
    }
}
