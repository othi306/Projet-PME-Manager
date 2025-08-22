import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useSupabaseData<T>(
  table: string,
  select: string = '*',
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: result, error } = await supabase
          .from(table)
          .select(select);

        if (error) throw error;
        setData(result || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, select, user, ...dependencies]);

  const insert = async (values: Partial<T>) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert([{ ...values, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      setData(prev => [result, ...prev]);
      return { data: result, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const update = async (id: string, values: Partial<T>) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(values)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setData(prev => prev.map(item => 
        (item as any).id === id ? result : item
      ));
      return { data: result, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const remove = async (id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      setData(prev => prev.filter(item => (item as any).id !== id));
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return {
    data,
    loading,
    error,
    insert,
    update,
    remove,
    refetch: () => {
      // Trigger re-fetch by updating dependencies
    }
  };
}