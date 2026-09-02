export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type TaskCategory = 
  | 'backend' 
  | 'frontend' 
  | 'funcionalidade' 
  | 'entregavel' 
  | 'migracao' 
  | 'testes' 
  | 'geral';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  category: TaskCategory;
  notes?: string;
  assignedTo?: 'Dev 1' | 'Dev 2' | 'Designer / Produto' | 'Geral';
  createdAt?: string;
}

export interface Sprint {
  id: string;
  order: number;
  number: number;
  title: string;
  subtitle?: string;
  durationWeeks: number;
  startDate?: string;
  endDate?: string;
  customDateLabel?: string;
  isMvp: boolean;
  notes?: string;
  tasks: TaskItem[];
}

export type QuickNoteType = 'question_client' | 'improvement' | 'bug' | 'general';

export interface QuickNote {
  id: string;
  title: string;
  description?: string;
  type: QuickNoteType;
  status: 'open' | 'resolved';
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface BoardState {
  version: number;
  baseStartDate: string;
  sprintDurationWeeks: number;
  sprints: Sprint[];
  quickNotes: QuickNote[];
  lastUpdated?: string;
}
