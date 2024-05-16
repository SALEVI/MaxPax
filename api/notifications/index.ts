import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '~/utils/supabase';

export const useNotificationList = () => {
  return useQuery({
    //maybe rename to sensor_data?
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error } = await supabase
        .from('notifications')
        .insert({
          title: data.title,
          body: data.body,
          name: data.name,
          status: data.status,
          value: data.value,
        })
        .single();

      if (error) {
        throw error;
      }
    },
    async onSuccess() {
      console.log('success: notification added');
      // await queryClient.invalidateQueries(['notifications']);
    },
    onError(error) {
      console.log(error);
    },
  });
};
