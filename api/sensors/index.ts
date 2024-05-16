import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// import { TablesUpdate } from '~/database.types';
import { UpdateTables } from '~/types';
import { supabase } from '~/utils/supabase';

export const useSensorList = () => {
  return useQuery({
    //maybe rename to sensor_data?
    queryKey: ['sensors'],
    queryFn: async () => {
      const { data, error } = await supabase.from('sensor_data').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useSensor = (id?: number) => {
  return useQuery({
    queryKey: ['sensors', id],
    queryFn: async () => {
      let query = supabase.from('sensor_data').select('*');
      if (id !== undefined) {
        query = query.eq('id', id);
      }
      const { data, error } = await query;
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useSensorCategory = (category: string) => {
  return useQuery({
    queryKey: ['sensors', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .eq('category', category);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useUpdateSensor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: UpdateTables<'sensor_data'>) {
      // with destructioning data.id -> id
      // const { id } = data;

      if (data.id === undefined) {
        throw new Error('ID is undefined');
      }

      const { error, data: updatedSensor } = await supabase
        .from('sensor_data')
        .update({
          //later on add start and end time for the sensor to automatically start to work
          status: data.status,
        })
        .eq('id', data.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedSensor;
    },
    async onSuccess(_, { category, id }) {
      await queryClient.invalidateQueries({ queryKey: ['sensors'] });
      await queryClient.invalidateQueries({ queryKey: ['sensors', id] });
      await queryClient.invalidateQueries({ queryKey: ['sensors', category] });
    },
    onError(error) {
      console.log(error);
    },
  });
};
