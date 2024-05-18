import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { UpdateTables } from '~/types';
import { supabase } from '~/utils/supabase';

export const usePresetAwayList = () => {
  return useQuery({
    //maybe rename to sensor_data?
    queryKey: ['presetAway'],
    queryFn: async () => {
      const { data, error } = await supabase.from('presetAway').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useUpdatePresetAway = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: UpdateTables<'presetAway'>) {
      // with destructioning data.id -> id
      // const { id } = data;

      if (data.id === undefined) {
        throw new Error('ID is undefined');
      }

      const { error, data: updatedPresetAway } = await supabase
        .from('presetAway')
        .update({
          //later on add start and end time for the sensor to automatically start to work
          status: data.status,
        })
        .eq('id', data.id)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return updatedPresetAway;
    },
    async onSuccess(_, id) {
      await queryClient.invalidateQueries({ queryKey: ['presetAway'] });
      await queryClient.invalidateQueries({ queryKey: ['presetAway', id] });
    },
    onError(error) {
      console.log(error);
    },
  });
};

export const usePresetHomeList = () => {
  return useQuery({
    //maybe rename to sensor_data?
    queryKey: ['presetHome'],
    queryFn: async () => {
      const { data, error } = await supabase.from('presetHome').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useUpdatePresetHome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: UpdateTables<'presetHome'>) {
      // with destructioning data.id -> id
      // const { id } = data;

      if (data.id === undefined) {
        throw new Error('ID is undefined');
      }

      const { error, data: updatedPresetHome } = await supabase
        .from('presetHome')
        .update({
          //later on add start and end time for the sensor to automatically start to work
          status: data.status,
        })
        .eq('id', data.id)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return updatedPresetHome;
    },
    async onSuccess(_, id) {
      await queryClient.invalidateQueries({ queryKey: ['presetHome'] });
      await queryClient.invalidateQueries({ queryKey: ['presetHome', id] });
    },
    onError(error) {
      console.log(error);
    },
  });
};

export const usePresetDisarmedList = () => {
  return useQuery({
    //maybe rename to sensor_data?
    queryKey: ['presetDisarmed'],
    queryFn: async () => {
      const { data, error } = await supabase.from('presetDisarmed').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useUpdatePresetDisarmed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: UpdateTables<'presetDisarmed'>) {
      // with destructioning data.id -> id
      // const { id } = data;

      if (data.id === undefined) {
        throw new Error('ID is undefined');
      }

      const { error, data: updatedPresetDisarmed } = await supabase
        .from('presetDisarmed')
        .update({
          //later on add start and end time for the sensor to automatically start to work
          status: data.status,
        })
        .eq('id', data.id)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return updatedPresetDisarmed;
    },
    async onSuccess(_, id) {
      await queryClient.invalidateQueries({ queryKey: ['presetDisarmed'] });
      await queryClient.invalidateQueries({ queryKey: ['presetDisarmed', id] });
    },
    onError(error) {
      console.log(error);
    },
  });
};
