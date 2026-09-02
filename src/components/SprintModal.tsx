import React, { useState, useEffect } from 'react';
import { Sprint } from '@/types/board';
import { X, Check, Sparkles } from 'lucide-react';

interface SprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sprintData: Partial<Sprint>, sprintId?: string) => void;
  sprintToEdit?: Sprint | null;
  nextNumber?: number;
}

export const SprintModal: React.FC<SprintModalProps> = ({
  isOpen,
  onClose,
  onSave,
  sprintToEdit,
  nextNumber = 1,
}) => {
  const [number, setNumber] = useState(nextNumber);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [durationWeeks, setDurationWeeks] = useState(2);
  const [customDateLabel, setCustomDateLabel] = useState('');
  const [isMvp, setIsMvp] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (sprintToEdit) {
      setNumber(sprintToEdit.number);
      setTitle(sprintToEdit.title);
      setSubtitle(sprintToEdit.subtitle || '');
      setDurationWeeks(sprintToEdit.durationWeeks || 2);
      setCustomDateLabel(sprintToEdit.customDateLabel || '');
      setIsMvp(sprintToEdit.isMvp);
      setNotes(sprintToEdit.notes || '');
    } else {
      setNumber(nextNumber);
      setTitle(`Sprint ${nextNumber} — `);
      setSubtitle('');
      setDurationWeeks(2);
      setCustomDateLabel('2 semanas');
      setIsMvp(nextNumber <= 6);
      setNotes('');
    }
  }, [sprintToEdit, isOpen, nextNumber]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(
      {
        number: Number(number),
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        durationWeeks: Number(durationWeeks) || 2,
        customDateLabel: customDateLabel.trim() || undefined,
        isMvp,
        notes: notes.trim() || undefined,
      },
      sprintToEdit?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {sprintToEdit ? 'Editar Sprint' : 'Nova Sprint'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Número
              </label>
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Duração (Semanas)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(parseInt(e.target.value) || 2)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Título da Sprint *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Sprint 2 — Gestão de Cursos (Admin)"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subtítulo / Objetivo Central
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ex: Base do sistema. Tudo depende disso."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Data Personalizada (Texto ou Intervalo)
            </label>
            <input
              type="text"
              value={customDateLabel}
              onChange={(e) => setCustomDateLabel(e.target.value)}
              placeholder="Ex: 17 - 31 de setembro"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <input
              type="checkbox"
              id="isMvp"
              checked={isMvp}
              onChange={(e) => setIsMvp(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor="isMvp" className="text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1 cursor-pointer">
              <Sparkles className="w-3.5 h-3.5" />
              Faz parte do MVP (Primeiro Lançamento - Sprints 1 a 6)
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notas Adicionais
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informações extras da sprint..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
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
              <Check className="w-4 h-4" />
              <span>Salvar Sprint</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
