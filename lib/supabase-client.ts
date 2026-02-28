/**
 * Supabase Client for Realtime Features
 * Used for:
 * - Order status subscriptions (customer)
 * - Kitchen availability updates (customer)
 * - New order alerts (business)
 * - Live dashboard updates (business)
 * - New registration alerts (admin)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.'
  );
}

// Create Supabase client with Realtime enabled
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We handle auth via our own auth-context
    autoRefreshToken: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Rate limit for realtime events
    },
  },
});

/**
 * Connection state management
 */
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_BASE_DELAY = 1000; // Start with 1 second

/**
 * Exponential backoff for reconnection
 */
function getReconnectDelay(attempt: number): number {
  return Math.min(RECONNECT_BASE_DELAY * Math.pow(2, attempt), 30000); // Max 30s
}

/**
 * Subscribe to Realtime connection state
 */
export function setupRealtimeConnection(
  onConnect?: () => void,
  onDisconnect?: () => void
) {
  const channel = supabase.channel('system');

  channel
    .on('system', { event: '*' }, (payload) => {
      console.log('[Realtime] System event:', payload);
    })
    .subscribe((status) => {
      console.log('[Realtime] Connection status:', status);

      if (status === 'SUBSCRIBED') {
        isConnected = true;
        reconnectAttempts = 0;
        onConnect?.();
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        isConnected = false;
        onDisconnect?.();

        // Attempt reconnection with exponential backoff
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const delay = getReconnectDelay(reconnectAttempts);
          console.log(`[Realtime] Reconnecting in ${delay}ms (attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);

          setTimeout(() => {
            reconnectAttempts++;
            channel.subscribe();
          }, delay);
        } else {
          console.error('[Realtime] Max reconnection attempts reached. Falling back to polling.');
        }
      }
    });

  return channel;
}

/**
 * Check if Realtime is connected
 */
export function isRealtimeConnected(): boolean {
  return isConnected;
}

/**
 * Get reconnection attempts count
 */
export function getReconnectAttempts(): number {
  return reconnectAttempts;
}
