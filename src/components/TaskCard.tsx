import React, { useState } from 'react';
import { TaskItem, TaskStatus } from '@/types/board';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { DevBadge } from './DevBadge';
import { GripVertical, MoreVertical, Edit2, Trash2, ArrowRight, MessageSquareText } from 'lucide-react';

interface TaskCardProps {
  task: TaskItem;
  sprintId: string;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEdit: (task: TaskItem, sprintId: string) => void;
  onDelete: (taskId: string, sprintId: string) => void;
  onMoveToBacklog?: (task: TaskItem, sprintId: string) => void;
  onDragStart?: (e: React.DragEvent, taskId: string, sprintId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  sprintId,
  onStatusChange,
  onEdit,
  onDelete,
  onMoveToBacklog,
  onDragStart,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const cycleStatus = () => {
    let next: TaskStatus = 'todo';
    if (task.status === 'todo') next = 'in_progress';
    else if (task.status === 'in_progress') next = 'done';
    else next = 'todo';
    onStatusChange(task.id, next);
  };

  const isDone = task.status === 'done';
  const isInProgress = task.status === 'in_progress';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, task.id, sprintId)}
      className={`group relative flex items-start gap-2.5 p-3 rounded-xl border transition-all duration-200 ${
        isDone
          ? 'bg-emerald-500/[0.04] dark:bg-emerald-950/20 border-emerald-500/20 dark:border-emerald-800/40 hover:border-emerald-500/40'
          : isInProgress
          ? 'bg-amber-500/[0.05] dark:bg-amber-950/20 border-amber-500/30 dark:border-amber-800/50 hover:border-amber-500/50 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      }`}
    >
      {/* Drag Handle */}
      <div
        className="mt-0.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors"
        title="Arraste para mover de sprint ou reordenar"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Checkbox / Status Toggle */}
      <div className="shrink-0 mt-0.5">
        <StatusBadge
          status={task.status}
          size="md"
          interactive
          onToggle={cycleStatus}
        />
      </div>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            onClick={cycleStatus}
            className={`text-sm font-medium leading-snug cursor-pointer transition-colors select-none ${
              isDone
                ? 'line-through text-slate-400 dark:text-slate-500'
                : isInProgress
                ? 'text-amber-950 dark:text-amber-200 font-semibold'
                : 'text-slate-800 dark:text-slate-200 hover:text-primary'
            }`}
          >
            {task.title}
          </p>

          {/* Actions Dropdown Button */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Opções da tarefa"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Menu Popover */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(task, sprintId);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Editar Tarefa</span>
                  </button>

                  {onMoveToBacklog && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onMoveToBacklog(task, sprintId);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span>Enviar pro Backlog</span>
                    </button>
                  )}

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(task.id, sprintId);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir Tarefa</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Notes */}
        {task.notes && (
          <div className="mt-1.5 text-xs text-amber-800/90 dark:text-amber-300/90 bg-amber-500/10 px-2 py-1 rounded-md flex items-center gap-1.5">
            <MessageSquareText className="w-3 h-3 shrink-0" />
            <span className="italic">{task.notes}</span>
          </div>
        )}

        {/* Badges Footer */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <CategoryBadge category={task.category} size="sm" />
          <DevBadge assignedTo={task.assignedTo} />
        </div>
      </div>
    </div>
  );
};
