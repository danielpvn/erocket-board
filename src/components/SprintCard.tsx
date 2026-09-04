import React, { useState, useEffect } from 'react';
import { Sprint, TaskItem, TaskStatus, TaskCategory } from '@/types/board';
import { TaskCard } from './TaskCard';
import { calculateSprintStats, getSprintScheduleStatus } from '@/lib/dateUtils';
import {
  GripVertical,
  Calendar,
  Sparkles,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Clock,
  Flame,
  AlertCircle,
} from 'lucide-react';

interface SprintCardProps {
  sprint: Sprint;
  isFirst: boolean;
  isLast: boolean;
  defaultExpanded?: boolean;
  onStatusChange: (taskId: string, newStatus: TaskStatus, sprintId: string) => void;
  onEditSprint: (sprint: Sprint) => void;
  onDeleteSprint: (sprintId: string) => void;
  onMoveSprint: (sprintId: string, direction: 'up' | 'down') => void;
  onAddTask: (sprintId: string) => void;
  onQuickAddTask: (sprintId: string, title: string, category: TaskCategory) => void;
  onEditTask: (task: TaskItem, sprintId: string) => void;
  onDeleteTask: (taskId: string, sprintId: string) => void;
  onMoveTaskToBacklog?: (task: TaskItem, sprintId: string) => void;
  onDragStartSprint?: (e: React.DragEvent, sprintId: string) => void;
  onDragOverSprint?: (e: React.DragEvent, sprintId: string) => void;
  onDropOnSprint?: (e: React.DragEvent, targetSprintId: string) => void;
  onDragStartTask?: (e: React.DragEvent, taskId: string, sourceSprintId: string) => void;
}

export const SprintCard: React.FC<SprintCardProps> = ({
  sprint,
  isFirst,
  isLast,
  defaultExpanded = true,
  onStatusChange,
  onEditSprint,
  onDeleteSprint,
  onMoveSprint,
  onAddTask,
  onQuickAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTaskToBacklog,
  onDragStartSprint,
  onDragOverSprint,
  onDropOnSprint,
  onDragStartTask,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(!defaultExpanded);

  // Sync if defaultExpanded changes
  useEffect(() => {
    setIsCollapsed(!defaultExpanded);
  }, [defaultExpanded]);
  const [showMenu, setShowMenu] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState<TaskCategory>('funcionalidade');
  const [isAddingQuick, setIsAddingQuick] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isDragOver, setIsDragOver] = useState(false);

  const stats = calculateSprintStats(sprint);
  const schedule = getSprintScheduleStatus(sprint);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onQuickAddTask(sprint.id, quickTitle.trim(), quickCategory);
    setQuickTitle('');
    setIsAddingQuick(false);
  };

  const filteredTasks = sprint.tasks.filter((t) => {
    if (activeCategoryFilter === 'all') return true;
    return t.category === activeCategoryFilter;
  });

  const categoriesPresent = Array.from(new Set(sprint.tasks.map((t) => t.category)));

  return (
    <div
      draggable
      onDragStart={(e) => onDragStartSprint && onDragStartSprint(e, sprint.id)}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
        if (onDragOverSprint) onDragOverSprint(e, sprint.id);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        setIsDragOver(false);
        if (onDropOnSprint) onDropOnSprint(e, sprint.id);
      }}
      className={`rounded-2xl border transition-all duration-200 ${
        isDragOver
          ? 'border-primary ring-2 ring-primary/20 bg-primary/[0.02] dark:bg-primary/[0.08]'
          : schedule.status === 'delayed'
          ? 'border-rose-500/40 bg-rose-500/[0.02] dark:bg-rose-950/10'
          : stats.isCompleted
          ? 'border-emerald-500/30 bg-emerald-500/[0.03] dark:bg-emerald-950/20 dark:border-emerald-500/30'
          : sprint.isMvp
          ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90'
          : 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50'
      } shadow-sm overflow-hidden`}
    >
      {/* Sprint Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div
              className="mt-1 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-grab active:cursor-grabbing transition-colors shrink-0"
              title="Arraste esta sprint para reordenar"
            >
              <GripVertical className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {sprint.title}
                </h3>

                {sprint.isMvp && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                    <Sparkles className="w-3 h-3" />
                    MVP
                  </span>
                )}

                {/* Status do Prazo / Deadline */}
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${schedule.badgeClass}`}>
                  {schedule.status === 'delayed' && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                  {schedule.status === 'warning' && <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                  {schedule.status === 'in_progress' && <Flame className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  {schedule.status === 'completed' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  <span>{schedule.label}</span>
                </span>

                {/* Aviso quando fechada mas com itens pendentes */}
                {isCollapsed && !stats.isCompleted && (stats.todo > 0 || stats.inProgress > 0) && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-500/30 shadow-xs" title={`${stats.todo + stats.inProgress} tarefas pendentes nesta sprint`}>
                    <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{stats.todo + stats.inProgress} {stats.todo + stats.inProgress === 1 ? 'pendência' : 'pendências'}</span>
                  </span>
                )}
              </div>

              {sprint.subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {sprint.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2.5 mt-2.5">
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{sprint.customDateLabel || '2 semanas'}</span>
                </div>

                <div className="text-xs text-slate-400 dark:text-slate-500">
                  {stats.done} de {stats.total} concluídos ({stats.percent}%)
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isCollapsed ? 'Expandir tarefas' : 'Recolher tarefas'}
            >
              {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Opções da Sprint"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onAddTask(sprint.id);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Plus className="w-4 h-4 text-slate-500" />
                      <span>Adicionar Atividade</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onEditSprint(sprint);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4 text-slate-500" />
                      <span>Editar Detalhes</span>
                    </button>

                    {!isFirst && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowMenu(false);
                          onMoveSprint(sprint.id, 'up');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <ArrowUp className="w-4 h-4 text-slate-500" />
                        <span>Mover para Cima</span>
                      </button>
                    )}

                    {!isLast && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowMenu(false);
                          onMoveSprint(sprint.id, 'down');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <ArrowDown className="w-4 h-4 text-slate-500" />
                        <span>Mover para Baixo</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onDeleteSprint(sprint.id);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Excluir Sprint</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              stats.isCompleted
                ? 'bg-emerald-500'
                : stats.percent > 0
                ? 'bg-gradient-to-r from-amber-500 to-emerald-500'
                : 'bg-slate-300'
            }`}
            style={{ width: `${stats.percent}%` }}
          />
        </div>
      </div>

      {/* Tasks List */}
      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-4">
          {categoriesPresent.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/60 text-xs">
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  activeCategoryFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Todas ({sprint.tasks.length})
              </button>
              {categoriesPresent.map((cat) => {
                const count = sprint.tasks.filter((t) => t.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-colors ${
                      activeCategoryFilter === cat
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {filteredTasks.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              Nenhuma atividade cadastrada nesta visualização.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  sprintId={sprint.id}
                  onStatusChange={(taskId, newStatus) =>
                    onStatusChange(taskId, newStatus, sprint.id)
                  }
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onMoveToBacklog={onMoveTaskToBacklog}
                  onDragStart={onDragStartTask}
                />
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {isAddingQuick ? (
              <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="Nome da atividade rápida..."
                  autoFocus
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value as TaskCategory)}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <option value="backend">Backend</option>
                    <option value="frontend">Frontend</option>
                    <option value="funcionalidade">Funcionalidade</option>
                    <option value="entregavel">Entregável</option>
                    <option value="migracao">Migração</option>
                    <option value="testes">Testes / QA</option>
                    <option value="geral">Geral</option>
                  </select>

                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary-hover active:scale-95 transition-all"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingQuick(false)}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddingQuick(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover p-1.5 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar atividade rápida</span>
                </button>

                <button
                  type="button"
                  onClick={() => onAddTask(sprint.id)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  + Formulário completo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
