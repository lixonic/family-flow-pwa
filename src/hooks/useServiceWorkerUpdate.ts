import { useEffect, useState } from 'react';

interface UseServiceWorkerUpdateReturn {
  updateAvailable: boolean;
  isUpdating: boolean;
  updateApp: () => void;
  dismissUpdate: () => void;
}

export function useServiceWorkerUpdate(): UseServiceWorkerUpdateReturn {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateCheck, setLastUpdateCheck] = useState<number>(0);

  // Check for updates every 24 hours maximum
  const UPDATE_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  useEffect(() => {
    // Register service worker update listener
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {

        // Listen for new service worker waiting
        if (reg.waiting) {
          setUpdateAvailable(true);
        }

        // Listen for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is installed and waiting
                setUpdateAvailable(true);
              }
            });
          }
        });

        // Listen for controlled updates (when new SW takes control)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          // Reload to get the new version
          window.location.reload();
        });
      });

      // Check for updates periodically (respecting 24-hour limit)
      const checkForUpdates = () => {
        const now = Date.now();
        if (now - lastUpdateCheck >= UPDATE_CHECK_INTERVAL) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.update().catch((error) => {
              console.log('Update check failed:', error);
            });
          });
          setLastUpdateCheck(now);
        }
      };

      // Check for updates on app startup (after a delay to not interrupt initial load)
      const startupCheckTimeout = setTimeout(checkForUpdates, 5000);
      
      // Check for updates when app becomes visible (respecting rate limit)
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          checkForUpdates();
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearTimeout(startupCheckTimeout);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [lastUpdateCheck]);

  const updateApp = () => {
    setIsUpdating(true);

    // With skipWaiting: true in vite.config.ts, we can just reload
    // The service worker will automatically take control
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Give a brief moment for user feedback
  };

  const dismissUpdate = () => {
    setUpdateAvailable(false);
    // Remember dismissal for this session
    sessionStorage.setItem('updateDismissed', 'true');
  };

  // Don't show update if dismissed in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('updateDismissed');
    if (dismissed && updateAvailable) {
      setUpdateAvailable(false);
    }
  }, [updateAvailable]);

  // Log version updates for debugging (optional)
  useEffect(() => {
    if (updateAvailable) {
      console.log('Family Flow: Update available - users may skip intermediate versions');
      // Could add version checking logic here if needed in future
    }
  }, [updateAvailable]);

  return {
    updateAvailable: updateAvailable && !isUpdating,
    isUpdating,
    updateApp,
    dismissUpdate,
  };
}