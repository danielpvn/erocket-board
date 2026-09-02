import React, { useState } from 'react';
import { X, Calendar, RefreshCw } from 'lucide-react';

interface DateSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseStartDate: string;
  sprintDurationWeeks: number;
  onApplyRecalculate: (newStartDate: string, durationWeeks: number) => void;
}

export const DateSettingsModal: React.FC<DateSettingsModalProps> = ({
  isOpen,
  onClose,
  baseStartDate,
  sprintDurationWeeks,
  onApplyRecalculate,
}) => {
  const [startDate, setStartDate] = useState(baseStartDate || '2026-09-01');
  const [duration, setDuration] = useState(sprintDurationWeeks || 2);

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyRecalculate(startDate, Number(duration) || 2);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Ajuste e Cálculo de Datas
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleApply} className="p-4 sm:p-5 space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Ao recalcular, o sistema irá atualizar as datas de início e término de todas as sprints sequencialmente em ciclos de 2 semanas com base na data inicial definida abaixo.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Data de Início do Projeto / Sprint 1
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Duração Padrão por Sprint
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
            >
              <option value={1}>1 Semana (7 dias)</option>
              <option value={2}>2 Semanas (14 dias - Recomendado)</option>
              <option value={3}>3 Semanas (21 dias)</option>
              <option value={4}>4 Semanas (1 Mês)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recalcular Todas as Datas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
