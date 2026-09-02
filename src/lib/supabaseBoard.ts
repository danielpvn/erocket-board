import { supabase, isSupabaseConfigured } from './supabase';
import { BoardState } from '@/types/board';
import { INITIAL_BOARD_DATA } from './initialData';

const BOARD_ROW_ID = 'erocket_main';

/**
 * Carrega o estado do quadro do Supabase. Se não existir, cria o registro inicial.
 */
export async function fetchBoardFromCloud(): Promise<BoardState | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('boards')
      .select('data')
      .eq('id', BOARD_ROW_ID)
      .single();

    if (error) {
      // Se não encontrou o registro (código PGRST116), vamos criá-lo
      if (error.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('boards')
          .insert([{ id: BOARD_ROW_ID, data: INITIAL_BOARD_DATA }]);

        if (insertError) {
          console.error('Erro ao criar quadro inicial no Supabase:', insertError);
          return null;
        }
        return INITIAL_BOARD_DATA;
      }
      console.error('Erro ao buscar dados do Supabase:', error);
      return null;
    }

    if (data && data.data && Array.isArray(data.data.sprints)) {
      return data.data as BoardState;
    }
  } catch (err) {
    console.error('Exceção ao conectar no Supabase:', err);
  }

  return null;
}

/**
 * Salva o estado do quadro no Supabase.
 */
export async function saveBoardToCloud(state: BoardState): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }

  try {
    const toSave: BoardState = {
      ...state,
      lastUpdated: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('boards')
      .upsert({
        id: BOARD_ROW_ID,
        data: toSave,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Erro ao salvar quadro no Supabase:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exceção ao salvar no Supabase:', err);
    return false;
  }
}

/**
 * Escuta alterações em tempo real (Realtime WebSocket) na tabela de boards.
 */
export function subscribeToBoardRealtime(
  onUpdate: (newState: BoardState) => void
): (() => void) | null {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  const channel = supabase
    .channel('erocket_board_realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'boards',
        filter: `id=eq.${BOARD_ROW_ID}`,
      },
      (payload) => {
        const newRecord = payload.new as { data?: BoardState } | undefined;
        if (newRecord && newRecord.data && Array.isArray(newRecord.data.sprints)) {
          onUpdate(newRecord.data);
        }
      }
    )
    .subscribe();

  return () => {
    if (supabase) {
      supabase.removeChannel(channel);
    }
  };
}
