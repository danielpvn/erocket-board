import { BoardState } from '@/types/board';
import { INITIAL_BOARD_DATA } from './initialData';

const STORAGE_KEY = 'erocket_sprint_board_data_v1';

export function loadBoardState(): BoardState {
  if (typeof window === 'undefined') {
    return INITIAL_BOARD_DATA;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_BOARD_DATA;
    }
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.sprints)) {
      return parsed as BoardState;
    }
  } catch (err) {
    console.error('Erro ao ler estado do localStorage:', err);
  }

  return INITIAL_BOARD_DATA;
}

export function saveBoardState(state: BoardState): void {
  if (typeof window === 'undefined') return;

  try {
    const toSave: BoardState = {
      ...state,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.error('Erro ao salvar estado no localStorage:', err);
  }
}

export function exportBoardToJson(state: BoardState): void {
  try {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    link.href = url;
    link.download = `erocket-mentoria-board-backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Erro ao exportar JSON:', err);
  }
}

export function parseImportedJson(jsonText: string): BoardState {
  const data = JSON.parse(jsonText);
  if (!data || !Array.isArray(data.sprints)) {
    throw new Error('Arquivo JSON inválido: nenhuma lista de sprints encontrada.');
  }

  return {
    version: data.version || 1,
    baseStartDate: data.baseStartDate || '2026-09-01',
    sprintDurationWeeks: data.sprintDurationWeeks || 2,
    sprints: data.sprints,
    quickNotes: Array.isArray(data.quickNotes) ? data.quickNotes : [],
    lastUpdated: new Date().toISOString(),
  };
}
