import { useEffect, useRef, useCallback } from 'react';

const CHANNEL_NAME = 'nexus_collaborative_sync_channel';

export function useBroadcast(onMessageReceived) {
  const channelRef = useRef(null);

  useEffect(() => {
    let channel;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel(CHANNEL_NAME);
        channelRef.current = channel;

        channel.onmessage = (event) => {
          if (event.data && onMessageReceived) {
            onMessageReceived(event.data);
          }
        };
      }
    } catch (err) {
      console.warn('BroadcastChannel error fallback:', err);
    }

    // Storage event listener fallback
    const handleStorage = (e) => {
      if (e.key === CHANNEL_NAME && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          if (onMessageReceived) onMessageReceived(payload);
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      if (channel) {
        channel.close();
      }
      window.removeEventListener('storage', handleStorage);
    };
  }, [onMessageReceived]);

  const postMessage = useCallback((payload) => {
    if (channelRef.current) {
      channelRef.current.postMessage(payload);
    } else {
      // Fallback
      localStorage.setItem(CHANNEL_NAME, JSON.stringify({ ...payload, _ts: Date.now() }));
    }
  }, []);

  return { postMessage };
}
