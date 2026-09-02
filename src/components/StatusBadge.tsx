import React from 'react';
import { TaskStatus } from '@/types/board';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onToggle?: () => void;
  showLabel?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  interactive = true,
  onToggle,
  showLabel = false,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'done':
        return {
          label: 'Concluído',
          icon: CheckCircle2,
          containerClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100',
          iconClass: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'in_progress':
        return {
          label: 'Em Andamento / Parcial',
          icon: Clock,
          containerClass: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100',
          iconClass: 'text-amber-600 dark:text-amber-400',
        };
      case 'todo':
      default:
        return {
          label: 'Pendente',
          icon: Circle,
          containerClass: 'bg-slate-50 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-100',
          iconClass: 'text-slate-400 dark:text-slate-500',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        if (interactive && onToggle) {
          e.stopPropagation();
          onToggle();
        }
      }}
      disabled={!interactive}
      title={interactive ? `Status: ${config.label} (Clique para alternar)` : config.label}
      className={`inline-flex items-center gap-1.5 rounded-lg border transition-all duration-150 select-none ${
        interactive ? 'cursor-pointer active:scale-95' : 'cursor-default'
      } ${
        showLabel
          ? 'px-2.5 py-1 text-xs font-semibold'
          : 'p-1'
      } ${config.containerClass}`}
    >
      <Icon className={`${iconSizes[size]} ${config.iconClass} shrink-0`} />
      {showLabel && <span>{config.label}</span>}
    </button>
  );
};
