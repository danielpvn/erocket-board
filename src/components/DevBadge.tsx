import React from 'react';
import { User, Palette, Code } from 'lucide-react';

interface DevBadgeProps {
  assignedTo?: 'Dev 1' | 'Dev 2' | 'Designer / Produto' | 'Geral';
}

export const DevBadge: React.FC<DevBadgeProps> = ({ assignedTo }) => {
  if (!assignedTo) return null;

  const getConfig = () => {
    switch (assignedTo) {
      case 'Dev 1':
        return {
          icon: Code,
          label: 'Dev 1 (Backend/Full)',
          badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        };
      case 'Dev 2':
        return {
          icon: Code,
          label: 'Dev 2 (Frontend/Full)',
          badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        };
      case 'Designer / Produto':
        return {
          icon: Palette,
          label: 'Design / Produto',
          badgeClass: 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border-pink-200 dark:border-pink-800',
        };
      case 'Geral':
      default:
        return {
          icon: User,
          label: 'Time Geral',
          badgeClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <span
      title={`Responsável: ${config.label}`}
      className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium ${config.badgeClass}`}
    >
      <Icon className="w-2.5 h-2.5 opacity-75" />
      <span>{assignedTo}</span>
    </span>
  );
};
