import React from 'react';
import { TaskCategory } from '@/types/board';
import { Database, Layout, Sparkles, Rocket, ArrowRightLeft, ShieldCheck, Tag } from 'lucide-react';

interface CategoryBadgeProps {
  category: TaskCategory;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'sm' }) => {
  const getCategoryConfig = () => {
    switch (category) {
      case 'backend':
        return {
          label: 'Backend',
          icon: Database,
          bgClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        };
      case 'frontend':
        return {
          label: 'Frontend',
          icon: Layout,
          bgClass: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        };
      case 'funcionalidade':
        return {
          label: 'Funcionalidade',
          icon: Sparkles,
          bgClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        };
      case 'entregavel':
        return {
          label: 'Entregável',
          icon: Rocket,
          bgClass: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-semibold',
        };
      case 'migracao':
        return {
          label: 'Migração',
          icon: ArrowRightLeft,
          bgClass: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-800',
        };
      case 'testes':
        return {
          label: 'Testes / QA',
          icon: ShieldCheck,
          bgClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        };
      case 'geral':
      default:
        return {
          label: 'Geral',
          icon: Tag,
          bgClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        };
    }
  };

  const config = getCategoryConfig();
  const Icon = config.icon;

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border font-medium transition-colors ${sizeClasses} ${config.bgClass}`}
    >
      <Icon className={`${iconSize} shrink-0 opacity-80`} />
      <span>{config.label}</span>
    </span>
  );
};
