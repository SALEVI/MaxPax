import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { supabase } from '~/utils/supabase';

export const useInsertNotificationListener = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const notificationsSubscription = supabase
      .channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          // console.log('Change received!', payload);
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      notificationsSubscription.unsubscribe();
    };
  }, [queryClient]);
};
