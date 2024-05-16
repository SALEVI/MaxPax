import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { supabase } from '~/utils/supabase';

export const useUpdateSensorListener = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const sensorsSubscription = supabase
      .channel('custom-update-channel')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sensor_data' },
        (payload) => {
          // console.log('Change received!', payload);
          queryClient.invalidateQueries({ queryKey: ['sensors'] });
        }
      )
      .subscribe();

    return () => {
      sensorsSubscription.unsubscribe();
    };
  }, []);
};
