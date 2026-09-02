'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BoardState, Sprint, TaskItem, TaskStatus, TaskCategory, QuickNote, QuickNoteType } from '@/types/board';
import { INITIAL_BOARD_DATA } from '@/lib/initialData';
import { loadBoardState, saveBoardState, exportBoardToJson } from '@/lib/storage';
import { recalculateSprintDates } from '@/lib/dateUtils';
import { isSupabaseConfigured } from '@/lib/supabase';
import { fetchBoardFromCloud, saveBoardToCloud, subscribeToBoardRealtime } from '@/lib/supabaseBoard';
import { BoardStatsHeader } from '@/components/BoardStatsHeader';
import { BoardFilterBar } from '@/components/BoardFilterBar';
import { SprintCard } from '@/components/SprintCard';
import { QuickBacklogDrawer } from '@/components/QuickBacklogDrawer';
import { TaskModal } from '@/components/TaskModal';
import { SprintModal } from '@/components/SprintModal';
import { DateSettingsModal } from '@/components/DateSettingsModal';
import { ImportJsonModal } from '@/components/ImportJsonModal';
import { Sparkles, Flag } from 'lucide-react';

export default function BoardHomePage() {
  const [boardState, setBoardState] = useState<BoardState>(INITIAL_BOARD_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'local_only'>('local_only');

  // Filters & UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScope, setSelectedScope] = useState<'all' | 'mvp' | 'pending' | 'in_progress' | 'done'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedSprintIdForTask, setSelectedSprintIdForTask] = useState<string | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);

  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [sprintToEdit, setSprintToEdit] = useState<Sprint | null>(null);

  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Drag & Drop tracking state
  const [draggedSprintId, setDraggedSprintId] = useState<string | null>(null);
  const [draggedTaskInfo, setDraggedTaskInfo] = useState<{ taskId: string; sourceSprintId: string } | null>(null);
  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);

  // Dark Mode state & persistence
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('erocket_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    setIsDarkMode(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('erocket_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('erocket_theme', 'light');
      }
      return next;
    });
  };

  // Load state from local storage & Supabase Cloud
  useEffect(() => {
    const saved = loadBoardState();
    setBoardState(saved);
    setIsLoaded(true);

    if (isSupabaseConfigured()) {
      setSyncStatus('syncing');
      fetchBoardFromCloud()
        .then((cloudData) => {
          if (cloudData) {
            setBoardState(cloudData);
            saveBoardState(cloudData);
            setSyncStatus('synced');
          } else {
            saveBoardToCloud(saved).then(() => setSyncStatus('synced'));
          }
        })
        .catch(() => {
          setSyncStatus('offline');
        });

      // Realtime subscription
      const unsubscribe = subscribeToBoardRealtime((updatedData) => {
        setBoardState(updatedData);
        saveBoardState(updatedData);
        setSyncStatus('synced');
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    } else {
      setSyncStatus('local_only');
    }
  }, []);

  // Save changes locally and to Supabase Cloud
  const updateBoard = useCallback((newState: BoardState) => {
    setBoardState(newState);
    saveBoardState(newState);

    if (isSupabaseConfigured()) {
      setSyncStatus('syncing');
      saveBoardToCloud(newState).then((success) => {
        setSyncStatus(success ? 'synced' : 'offline');
      });
    }
  }, []);

  // Recalcular datas
  const handleApplyRecalculate = (newStartDate: string, durationWeeks: number) => {
    const recalculated = recalculateSprintDates(boardState.sprints, newStartDate, durationWeeks);
    updateBoard({
      ...boardState,
      baseStartDate: newStartDate,
      sprintDurationWeeks: durationWeeks,
      sprints: recalculated,
    });
  };

  // Reset to initial PDF defaults
  const handleResetToDefault = () => {
    if (typeof window !== 'undefined' && window.confirm('Deseja restaurar o quadro para os dados originais do documento da Mentoria Lei Seca?')) {
      updateBoard(INITIAL_BOARD_DATA);
    }
  };

  // Task Status Toggle
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus, sprintId: string) => {
    const nextSprints = boardState.sprints.map((sprint) => {
      if (sprint.id !== sprintId) return sprint;
      return {
        ...sprint,
        tasks: sprint.tasks.map((task) => {
          if (task.id !== taskId) return task;
          return { ...task, status: newStatus };
        }),
      };
    });
    updateBoard({ ...boardState, sprints: nextSprints });
  };

  // Add / Edit Task
  const handleSaveTask = (taskData: Omit<TaskItem, 'id'>, taskId?: string) => {
    if (!selectedSprintIdForTask) return;

    const nextSprints = boardState.sprints.map((sprint) => {
      if (sprint.id !== selectedSprintIdForTask) return sprint;

      if (taskId) {
        return {
          ...sprint,
          tasks: sprint.tasks.map((t) => (t.id === taskId ? { ...t, ...taskData } : t)),
        };
      } else {
        const newTask: TaskItem = {
          ...taskData,
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          createdAt: new Date().toISOString(),
        };
        return {
          ...sprint,
          tasks: [...sprint.tasks, newTask],
        };
      }
    });

    updateBoard({ ...boardState, sprints: nextSprints });
  };

  const handleQuickAddTask = (sprintId: string, title: string, category: TaskCategory) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      category,
      status: 'todo',
      assignedTo: 'Geral',
      createdAt: new Date().toISOString(),
    };

    const nextSprints = boardState.sprints.map((sprint) => {
      if (sprint.id !== sprintId) return sprint;
      return { ...sprint, tasks: [...sprint.tasks, newTask] };
    });

    updateBoard({ ...boardState, sprints: nextSprints });
  };

  const handleDeleteTask = (taskId: string, sprintId: string) => {
    const nextSprints = boardState.sprints.map((sprint) => {
      if (sprint.id !== sprintId) return sprint;
      return {
        ...sprint,
        tasks: sprint.tasks.filter((t) => t.id !== taskId),
      };
    });
    updateBoard({ ...boardState, sprints: nextSprints });
  };

  const handleMoveTaskToBacklog = (task: TaskItem, sprintId: string) => {
    const newNote: QuickNote = {
      id: `qn-${Date.now()}`,
      title: task.title,
      description: task.notes,
      type: task.category === 'entregavel' ? 'improvement' : 'general',
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    const nextSprints = boardState.sprints.map((sprint) => {
      if (sprint.id !== sprintId) return sprint;
      return { ...sprint, tasks: sprint.tasks.filter((t) => t.id !== task.id) };
    });

    updateBoard({
      ...boardState,
      sprints: nextSprints,
      quickNotes: [newNote, ...boardState.quickNotes],
    });
  };

  // Sprint Add / Edit / Delete / Move
  const handleSaveSprint = (sprintData: Partial<Sprint>, sprintId?: string) => {
    if (sprintId) {
      const nextSprints = boardState.sprints.map((s) => (s.id === sprintId ? { ...s, ...sprintData } : s));
      updateBoard({ ...boardState, sprints: nextSprints });
    } else {
      const newSprint: Sprint = {
        id: `sprint-${Date.now()}`,
        order: boardState.sprints.length,
        number: sprintData.number || boardState.sprints.length,
        title: sprintData.title || `Sprint ${boardState.sprints.length}`,
        subtitle: sprintData.subtitle,
        durationWeeks: sprintData.durationWeeks || 2,
        customDateLabel: sprintData.customDateLabel || '2 semanas',
        isMvp: sprintData.isMvp || false,
        notes: sprintData.notes,
        tasks: [],
      };
      const updated = recalculateSprintDates([...boardState.sprints, newSprint], boardState.baseStartDate);
      updateBoard({ ...boardState, sprints: updated });
    }
  };

  const handleDeleteSprint = (sprintId: string) => {
    if (typeof window !== 'undefined' && window.confirm('Tem certeza que deseja excluir esta sprint e suas atividades?')) {
      const remaining = boardState.sprints.filter((s) => s.id !== sprintId);
      const recalculated = recalculateSprintDates(remaining, boardState.baseStartDate);
      updateBoard({ ...boardState, sprints: recalculated });
    }
  };

  const handleMoveSprintDirection = (sprintId: string, direction: 'up' | 'down') => {
    const index = boardState.sprints.findIndex((s) => s.id === sprintId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= boardState.sprints.length) return;

    const list = [...boardState.sprints];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const recalculated = recalculateSprintDates(list, boardState.baseStartDate);
    updateBoard({ ...boardState, sprints: recalculated });
  };

  // Quick Notes handlers
  const handleAddNote = (
    title: string,
    type: QuickNoteType,
    priority: 'low' | 'medium' | 'high',
    description?: string
  ) => {
    const newNote: QuickNote = {
      id: `qn-${Date.now()}`,
      title,
      type,
      priority,
      description,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    updateBoard({
      ...boardState,
      quickNotes: [newNote, ...boardState.quickNotes],
    });
  };

  const handleToggleResolveNote = (id: string) => {
    const updated = boardState.quickNotes.map((n) => {
      if (n.id !== id) return n;
      return { ...n, status: n.status === 'open' ? 'resolved' : 'open' } as QuickNote;
    });
    updateBoard({ ...boardState, quickNotes: updated });
  };

  const handleDeleteNote = (id: string) => {
    const updated = boardState.quickNotes.filter((n) => n.id !== id);
    updateBoard({ ...boardState, quickNotes: updated });
  };

  const handleMoveNoteToSprint = (note: QuickNote, targetSprintId: string) => {
    let cat: TaskCategory = 'funcionalidade';
    if (note.type === 'bug') cat = 'backend';
    if (note.type === 'improvement') cat = 'frontend';

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: note.title,
      notes: note.description,
      status: 'todo',
      category: cat,
      assignedTo: 'Geral',
      createdAt: new Date().toISOString(),
    };

    const nextSprints = boardState.sprints.map((s) => {
      if (s.id !== targetSprintId) return s;
      return { ...s, tasks: [...s.tasks, newTask] };
    });

    const nextNotes = boardState.quickNotes.filter((n) => n.id !== note.id);
    updateBoard({ ...boardState, sprints: nextSprints, quickNotes: nextNotes });
  };

  // Drag & Drop Handlers
  const handleDragStartSprint = (e: React.DragEvent, sprintId: string) => {
    e.dataTransfer.setData('text/sprint-id', sprintId);
    setDraggedSprintId(sprintId);
    setDraggedTaskInfo(null);
    setDraggedNoteId(null);
  };

  const handleDragStartTask = (e: React.DragEvent, taskId: string, sourceSprintId: string) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/task-id', taskId);
    e.dataTransfer.setData('text/source-sprint-id', sourceSprintId);
    setDraggedTaskInfo({ taskId, sourceSprintId });
    setDraggedSprintId(null);
    setDraggedNoteId(null);
  };

  const handleDragStartNote = (e: React.DragEvent, noteId: string) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/note-id', noteId);
    setDraggedNoteId(noteId);
    setDraggedSprintId(null);
    setDraggedTaskInfo(null);
  };

  const handleDropOnSprint = (e: React.DragEvent, targetSprintId: string) => {
    e.preventDefault();

    // 1. Drop de reordenação de Sprint
    const sprintId = e.dataTransfer.getData('text/sprint-id') || draggedSprintId;
    if (sprintId && sprintId !== targetSprintId) {
      const fromIndex = boardState.sprints.findIndex((s) => s.id === sprintId);
      const toIndex = boardState.sprints.findIndex((s) => s.id === targetSprintId);

      if (fromIndex !== -1 && toIndex !== -1) {
        const list = [...boardState.sprints];
        const [moved] = list.splice(fromIndex, 1);
        list.splice(toIndex, 0, moved);

        const recalculated = recalculateSprintDates(list, boardState.baseStartDate);
        updateBoard({ ...boardState, sprints: recalculated });
      }
      setDraggedSprintId(null);
      return;
    }

    // 2. Drop de Tarefa de outra Sprint
    const taskId = e.dataTransfer.getData('text/task-id') || draggedTaskInfo?.taskId;
    const sourceSprintId = e.dataTransfer.getData('text/source-sprint-id') || draggedTaskInfo?.sourceSprintId;

    if (taskId && sourceSprintId && sourceSprintId !== targetSprintId) {
      const sourceSprint = boardState.sprints.find((s) => s.id === sourceSprintId);
      const taskToMove = sourceSprint?.tasks.find((t) => t.id === taskId);

      if (taskToMove) {
        const nextSprints = boardState.sprints.map((s) => {
          if (s.id === sourceSprintId) {
            return { ...s, tasks: s.tasks.filter((t) => t.id !== taskId) };
          }
          if (s.id === targetSprintId) {
            return { ...s, tasks: [...s.tasks, taskToMove] };
          }
          return s;
        });

        updateBoard({ ...boardState, sprints: nextSprints });
      }
      setDraggedTaskInfo(null);
      return;
    }

    // 3. Drop de Nota do Backlog
    const noteId = e.dataTransfer.getData('text/note-id') || draggedNoteId;
    if (noteId) {
      const note = boardState.quickNotes.find((n) => n.id === noteId);
      if (note) {
        handleMoveNoteToSprint(note, targetSprintId);
      }
      setDraggedNoteId(null);
      return;
    }
  };

  // Filtered Sprints
  const filteredSprints = boardState.sprints
    .map((sprint) => {
      const tasksMatching = sprint.tasks.filter((task) => {
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(term);
          const matchesNotes = task.notes?.toLowerCase().includes(term);
          if (!matchesTitle && !matchesNotes) return false;
        }

        if (selectedCategory !== 'all' && task.category !== selectedCategory) {
          return false;
        }

        if (selectedScope === 'pending' && task.status !== 'todo') return false;
        if (selectedScope === 'in_progress' && task.status !== 'in_progress') return false;
        if (selectedScope === 'done' && task.status !== 'done') return false;

        return true;
      });

      return {
        ...sprint,
        tasks: tasksMatching,
      };
    })
    .filter((sprint) => {
      if (selectedScope === 'mvp' && !sprint.isMvp) return false;

      if (searchTerm.trim() || selectedScope === 'pending' || selectedScope === 'in_progress' || selectedScope === 'done' || selectedCategory !== 'all') {
        return sprint.tasks.length > 0;
      }

      return true;
    });

  const activeSprintForTaskTitle = boardState.sprints.find((s) => s.id === selectedSprintIdForTask)?.title;

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100">
      <BoardStatsHeader
        sprints={boardState.sprints}
        isDarkMode={isDarkMode}
        syncStatus={syncStatus}
        onToggleDarkMode={handleToggleDarkMode}
        onExport={() => exportBoardToJson(boardState)}
        onOpenImport={() => setIsImportModalOpen(true)}
        onOpenDateSettings={() => setIsDateModalOpen(true)}
        onAddSprint={() => {
          setSprintToEdit(null);
          setIsSprintModalOpen(true);
        }}
        onResetToDefault={handleResetToDefault}
      />

      <BoardFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedScope={selectedScope}
        onScopeChange={setSelectedScope}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isDrawerOpen={isDrawerOpen}
        onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        notesCount={boardState.quickNotes.filter((n) => n.status === 'open').length}
      />

      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className={`${isDrawerOpen ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'} space-y-4`}>
            {filteredSprints.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Nenhuma Sprint ou atividade encontrada com os filtros selecionados.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedScope('all');
                    setSelectedCategory('all');
                  }}
                  className="mt-3 text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              filteredSprints.map((sprint, index) => {
                const isEndOfMvp = sprint.number === 6;

                return (
                  <React.Fragment key={sprint.id}>
                    <SprintCard
                      sprint={sprint}
                      isFirst={index === 0}
                      isLast={index === filteredSprints.length - 1}
                      onStatusChange={handleTaskStatusChange}
                      onEditSprint={(s) => {
                        setSprintToEdit(s);
                        setIsSprintModalOpen(true);
                      }}
                      onDeleteSprint={handleDeleteSprint}
                      onMoveSprint={handleMoveSprintDirection}
                      onAddTask={(sId) => {
                        setSelectedSprintIdForTask(sId);
                        setTaskToEdit(null);
                        setIsTaskModalOpen(true);
                      }}
                      onQuickAddTask={handleQuickAddTask}
                      onEditTask={(task, sId) => {
                        setSelectedSprintIdForTask(sId);
                        setTaskToEdit(task);
                        setIsTaskModalOpen(true);
                      }}
                      onDeleteTask={handleDeleteTask}
                      onMoveTaskToBacklog={handleMoveTaskToBacklog}
                      onDragStartSprint={handleDragStartSprint}
                      onDropOnSprint={handleDropOnSprint}
                      onDragStartTask={handleDragStartTask}
                    />

                    {isEndOfMvp && selectedScope === 'all' && (
                      <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/15 border-2 border-dashed border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center font-black shrink-0 shadow-md">
                            <Flag className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5 justify-center sm:justify-start">
                              <Sparkles className="w-4 h-4 text-amber-600" />
                              Fim do Escopo do MVP (Lançamento Comercial)
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                              Sprints 1 a 6 prontas para ir ao ar e gerar receita. As sprints seguintes expandem Gamificação, Rankings e Go-Live total.
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/30 text-amber-900 dark:text-amber-300 shadow-xs">
                          Fase 1 Concluível
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </div>

          {isDrawerOpen && (
            <div className="lg:col-span-4 xl:col-span-3 sticky top-6">
              <QuickBacklogDrawer
                notes={boardState.quickNotes}
                sprints={boardState.sprints}
                onAddNote={handleAddNote}
                onToggleResolve={handleToggleResolveNote}
                onDeleteNote={handleDeleteNote}
                onMoveToSprint={handleMoveNoteToSprint}
                onDragStartNote={handleDragStartNote}
              />
            </div>
          )}
        </div>
      </main>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        sprintTitle={activeSprintForTaskTitle}
      />

      <SprintModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        onSave={handleSaveSprint}
        sprintToEdit={sprintToEdit}
        nextNumber={boardState.sprints.length}
      />

      <DateSettingsModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        baseStartDate={boardState.baseStartDate}
        sprintDurationWeeks={boardState.sprintDurationWeeks}
        onApplyRecalculate={handleApplyRecalculate}
      />

      <ImportJsonModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={(imported) => updateBoard(imported)}
      />
    </div>
  );
}
