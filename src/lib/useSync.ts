import { useCallback } from 'react';

import { useToast } from '@/components/Toast';

/** Mock Odoo sync: shows progress, then success. Swap the body once Odoo is wired up. */
export function useSync() {
  const toast = useToast();
  return useCallback(() => {
    toast.info('Syncing with Odoo…', 'Fetching the latest purchase orders');
    setTimeout(() => toast.success('Synced with Odoo', 'All purchase orders are up to date'), 1200);
  }, [toast]);
}
