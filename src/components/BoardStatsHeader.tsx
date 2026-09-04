import React from 'react';
import { Sprint } from '@/types/board';
import { calculateOverallStats } from '@/lib/dateUtils';
import {
  Download,
  Upload,
  Calendar,
  Plus,
  Sparkles,
  RotateCcw,
  Users,
  CheckCircle2,
  Rocket,
  Sun,
  Moon,
  Cloud,
  HardDrive,
  RefreshCw,
  LogOut,
  AlertTriangle,
  Clock,
} from 'lucide-react';

interface BoardStatsHeaderProps {
  sprints: Sprint[];
  isDarkMode: boolean;
  syncStatus?: 'synced' | 'syncing' | 'offline' | 'local_only';
  onToggleDarkMode: () => void;
  onLogout?: () => void;
  onExport: () => void;
  onOpenImport: () => void;
  onOpenDateSettings: () => void;
  onAddSprint: () => void;
  onResetToDefault: () => void;
}

export const BoardStatsHeader: React.FC<BoardStatsHeaderProps> = ({
  sprints,
  isDarkMode,
  syncStatus = 'local_only',
  onToggleDarkMode,
  onLogout,
  onExport,
  onOpenImport,
  onOpenDateSettings,
  onAddSprint,
  onResetToDefault,
}) => {
  const stats = calculateOverallStats(sprints);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shadow-emerald-500/10 border border-slate-200 dark:border-slate-800 shrink-0">
                <img src="/logo.png" alt="eRocket Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Mentoria de Lei Seca
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
                    Erocket Board
                  </span>
                  {syncStatus === 'synced' && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                      <Cloud className="w-3 h-3" />
                      <span>Nuvem Ativa</span>
                    </span>
                  )}
                  {syncStatus === 'syncing' && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-flex items-center gap-1 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Salvando na nuvem...</span>
                    </span>
                  )}
                  {syncStatus === 'local_only' && (
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 inline-flex items-center gap-1"
                      title="Salvo no navegador local. Configure o Supabase para sincronizar entre todos os devs."
                    >
                      <HardDrive className="w-3 h-3" />
                      <span>Modo Local</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>Gestão de Sprints e Entregáveis</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    2 Devs + 1 Design/Produto
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenDateSettings}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Ajustar data de início e recalcular datas das sprints"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Ajustar / Recalcular Datas</span>
            </button>

            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Baixar backup dos dados em JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Exportar Backup</span>
            </button>

            <button
              type="button"
              onClick={onOpenImport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Restaurar backup JSON salvo"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Importar JSON</span>
            </button>

            <button
              type="button"
              onClick={onResetToDefault}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Restaurar dados originais do documento PDF"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onToggleDarkMode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs"
              title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Modo Escuro</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onAddSprint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Sprint</span>
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 dark:hover:border-rose-900 transition-all cursor-pointer"
                title="Sair do Board"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
          {/* MVP Progress */}
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.06] to-amber-500/[0.01] dark:bg-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                  Progresso do MVP (Sprints 1 a 6)
                </span>
              </div>
              <span className="text-sm font-extrabold text-amber-800 dark:text-amber-300">
                {stats.mvp.percent}%
              </span>
            </div>

            <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${stats.mvp.percent}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>{stats.mvp.done} de {stats.mvp.total} tarefas concluídas</span>
              <span className="font-medium text-amber-800 dark:text-amber-400">Primeiro Lançamento</span>
            </div>
          </div>

          {/* Full Project Progress */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Plataforma Completa (Sprints 0 a 11)
                </span>
              </div>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {stats.total.percent}%
              </span>
            </div>

            <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${stats.total.percent}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>{stats.total.done} de {stats.total.total} tarefas concluídas</span>
              <span>{stats.totalSprints} Sprints Planejadas</span>
            </div>
          </div>

          {/* Estimates & Schedule Health */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/30 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Saúde do Cronograma
              </span>
              {stats.delayedSprintsCount > 0 ? (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  <span>{stats.delayedSprintsCount} Atrasada{stats.delayedSprintsCount > 1 ? 's' : ''}</span>
                </span>
              ) : stats.warningSprintsCount > 0 ? (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Reta Final</span>
                </span>
              ) : (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Cronograma em Dia</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[11px]">
              <div>
                <span className="text-slate-400 block">Fase 1 (MVP):</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">3 a 4 meses (S1-S6)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Ciclo padrão:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">2 sem / sprint</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
