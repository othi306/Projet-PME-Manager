import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface WithId {
  id: string;
}

export function useSupabaseData<T extends WithId>(
  table: string,
  select: string = '*',
  dependencies: unknown[] = []
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
        setData((result as unknown as T[]) || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
        setError(errorMessage);
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      return { data: null, error: errorMessage };
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
        item.id === id ? result : item
      ));
      return { data: result, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      return { data: null, error: errorMessage };
    }
  };

  const remove = async (id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      setData(prev => prev.filter(item => item.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      return { error: errorMessage };
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
