import React from 'react';
import { Search, Sparkles, PanelRightClose, PanelRightOpen, X } from 'lucide-react';

interface BoardFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedScope: 'all' | 'mvp' | 'pending' | 'in_progress' | 'done';
  onScopeChange: (scope: 'all' | 'mvp' | 'pending' | 'in_progress' | 'done') => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  notesCount: number;
}

export const BoardFilterBar: React.FC<BoardFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedScope,
  onScopeChange,
  selectedCategory,
  onCategoryChange,
  isDrawerOpen,
  onToggleDrawer,
  notesCount,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search & Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar tarefas ou entregáveis..."
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
            <button
              type="button"
              onClick={() => onScopeChange('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                selectedScope === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Todas as Sprints
            </button>

            <button
              type="button"
              onClick={() => onScopeChange('mvp')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedScope === 'mvp'
                  ? 'bg-amber-500 text-amber-950 font-bold'
                  : 'text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Somente MVP (S1-S6)</span>
            </button>

            <button
              type="button"
              onClick={() => onScopeChange('in_progress')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                selectedScope === 'in_progress'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Em Andamento
            </button>

            <button
              type="button"
              onClick={() => onScopeChange('pending')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                selectedScope === 'pending'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Pendentes
            </button>

            <button
              type="button"
              onClick={() => onScopeChange('done')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                selectedScope === 'done'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
              }`}
            >
              Concluídas
            </button>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
          >
            <option value="all">Todas as Categorias</option>
            <option value="backend">Backend</option>
            <option value="frontend">Frontend</option>
            <option value="funcionalidade">Funcionalidade</option>
            <option value="entregavel">Entregável</option>
            <option value="migracao">Migração</option>
            <option value="testes">Testes / QA</option>
          </select>
        </div>

        {/* Right: Toggle Backlog Drawer Button */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleDrawer}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              isDrawerOpen
                ? 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            {isDrawerOpen ? (
              <PanelRightClose className="w-4 h-4 text-purple-600" />
            ) : (
              <PanelRightOpen className="w-4 h-4 text-slate-500" />
            )}
            <span>Backlog & Dúvidas</span>
            {notesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-600 text-white font-bold">
                {notesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
