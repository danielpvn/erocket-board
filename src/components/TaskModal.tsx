import React, { useState, useEffect } from 'react';
import { TaskItem, TaskCategory, TaskStatus } from '@/types/board';
import { X, Check } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<TaskItem, 'id'>, taskId?: string) => void;
  taskToEdit?: TaskItem | null;
  sprintTitle?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  sprintTitle,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('funcionalidade');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [assignedTo, setAssignedTo] = useState<'Dev 1' | 'Dev 2' | 'Designer / Produto' | 'Geral'>('Geral');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setCategory(taskToEdit.category);
      setStatus(taskToEdit.status);
      setAssignedTo(taskToEdit.assignedTo || 'Geral');
      setNotes(taskToEdit.notes || '');
    } else {
      setTitle('');
      setCategory('funcionalidade');
      setStatus('todo');
      setAssignedTo('Geral');
      setNotes('');
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(
      {
        title: title.trim(),
        category,
        status,
        assignedTo,
        notes: notes.trim() || undefined,
      },
      taskToEdit?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {taskToEdit ? 'Editar Atividade' : 'Nova Atividade'}
            </h3>
            {sprintTitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {sprintTitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Título da Tarefa / Entregável *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Integração com gateway de pagamento PIX..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="backend">Backend</option>
                <option value="frontend">Frontend</option>
                <option value="funcionalidade">Funcionalidade</option>
                <option value="entregavel">Entregável (MVP / Marco)</option>
                <option value="migracao">Migração</option>
                <option value="testes">Testes / QA</option>
                <option value="geral">Geral</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status Atual
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="todo">⚪ Pendente</option>
                <option value="in_progress">🟡 Em Andamento / Parcial</option>
                <option value="done">🟢 Concluído</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Responsável
              </label>
              <select
                value={assignedTo}
                onChange={(e) =>
                  setAssignedTo(e.target.value as 'Dev 1' | 'Dev 2' | 'Designer / Produto' | 'Geral')
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="Dev 1">Dev 1 (Backend/Full)</option>
                <option value="Dev 2">Dev 2 (Frontend/Full)</option>
                <option value="Designer / Produto">Designer / Produto</option>
                <option value="Geral">Time Geral</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Observações / Detalhes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Falta integrar webhook..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
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
              <span>Salvar Atividade</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
