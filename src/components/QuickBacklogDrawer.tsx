import React, { useState } from 'react';
import { QuickNote, QuickNoteType, Sprint } from '@/types/board';
import {
  HelpCircle,
  Lightbulb,
  Bug,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  GripVertical,
  Sparkles,
  Tag,
  AlertCircle,
} from 'lucide-react';

interface QuickBacklogDrawerProps {
  notes: QuickNote[];
  sprints: Sprint[];
  onAddNote: (title: string, type: QuickNoteType, priority: 'low' | 'medium' | 'high', description?: string) => void;
  onToggleResolve: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onMoveToSprint: (note: QuickNote, targetSprintId: string) => void;
  onDragStartNote?: (e: React.DragEvent, noteId: string) => void;
}

export const QuickBacklogDrawer: React.FC<QuickBacklogDrawerProps> = ({
  notes,
  sprints,
  onAddNote,
  onToggleResolve,
  onDeleteNote,
  onMoveToSprint,
  onDragStartNote,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | QuickNoteType>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<QuickNoteType>('question_client');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDesc, setNewDesc] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddNote(newTitle.trim(), newType, newPriority, newDesc.trim() || undefined);
    setNewTitle('');
    setNewDesc('');
    setIsFormOpen(false);
  };

  const filteredNotes = notes.filter((n) => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const getTypeBadge = (type: QuickNoteType) => {
    switch (type) {
      case 'question_client':
        return {
          icon: HelpCircle,
          label: 'Dúvida com Cliente',
          badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        };
      case 'improvement':
        return {
          icon: Lightbulb,
          label: 'Melhoria',
          badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        };
      case 'bug':
        return {
          icon: Bug,
          label: 'Bug / Correção',
          badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        };
      case 'general':
      default:
        return {
          icon: Tag,
          label: 'Geral',
          badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        };
    }
  };

  const questionsCount = notes.filter((n) => n.type === 'question_client' && n.status === 'open').length;
  const improvementsCount = notes.filter((n) => n.type === 'improvement' && n.status === 'open').length;
  const bugsCount = notes.filter((n) => n.type === 'bug' && n.status === 'open').length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[calc(100vh-6.5rem)] max-h-[calc(100vh-6.5rem)] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Backlog Rápido & Dúvidas
              </h3>
              <p className="text-[11px] text-slate-500">
                Anotações, pendências com cliente e ideias
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="p-1.5 rounded-lg bg-primary text-white hover:bg-primary-hover active:scale-95 transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="Nova Anotação"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Anotar</span>
          </button>
        </div>

        {/* Tip */}
        <div className="mt-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          <span>
            <strong>Dica:</strong> Arraste qualquer item daqui direto para dentro de uma Sprint para transformá-lo em tarefa!
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Todas ({notes.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('question_client')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeTab === 'question_client'
                ? 'bg-purple-600 text-white'
                : 'text-slate-500 hover:bg-purple-50 dark:hover:bg-purple-950/30'
            }`}
          >
            <span>Dúvidas Cliente</span>
            {questionsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-200 text-purple-900 dark:bg-purple-900 dark:text-purple-100 font-bold">
                {questionsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('improvement')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeTab === 'improvement'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 hover:bg-blue-50 dark:hover:bg-blue-950/30'
            }`}
          >
            <span>Melhorias</span>
            {improvementsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-100 font-bold">
                {improvementsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bug')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeTab === 'bug'
                ? 'bg-rose-600 text-white'
                : 'text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            }`}
          >
            <span>Bugs</span>
            {bugsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-100 font-bold">
                {bugsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Form Box */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 space-y-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Título da dúvida ou melhoria..."
            autoFocus
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Detalhes ou contexto adicional (opcional)..."
            rows={2}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as QuickNoteType)}
                className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              >
                <option value="question_client">❓ Dúvida Cliente</option>
                <option value="improvement">💡 Melhoria</option>
                <option value="bug">🐛 Bug / Correção</option>
                <option value="general">📝 Geral</option>
              </select>

              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-2.5 py-1 text-xs rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary-hover shadow-xs"
              >
                Salvar
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-2.5">
        {filteredNotes.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
            Nenhuma anotação nesta categoria.
          </div>
        ) : (
          filteredNotes.map((note) => {
            const typeConfig = getTypeBadge(note.type);
            const TypeIcon = typeConfig.icon;
            const isResolved = note.status === 'resolved';

            return (
              <div
                key={note.id}
                draggable
                onDragStart={(e) => onDragStartNote && onDragStartNote(e, note.id)}
                className={`group relative p-3 rounded-xl border transition-all duration-150 ${
                  isResolved
                    ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60'
                    : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-primary/40'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div
                    className="mt-0.5 text-slate-300 group-hover:text-slate-500 cursor-grab active:cursor-grabbing shrink-0"
                    title="Arraste para uma Sprint"
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleResolve(note.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                    title={isResolved ? 'Marcar como aberto' : 'Marcar como resolvido'}
                  >
                    {isResolved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-semibold leading-snug break-words [overflow-wrap:anywhere] ${
                        isResolved
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {note.title}
                    </p>

                    {note.description && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed break-words [overflow-wrap:anywhere] bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                        {note.description}
                      </div>
                    )}

                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md border font-medium ${typeConfig.badgeClass}`}
                      >
                        <TypeIcon className="w-2.5 h-2.5" />
                        <span>{typeConfig.label}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              onMoveToSprint(note, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="text-[10px] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 cursor-pointer hover:border-primary"
                          title="Enviar para uma Sprint"
                        >
                          <option value="" disabled>
                            Mover para Sprint...
                          </option>
                          {sprints.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title.split('—')[0].trim() || `Sprint ${s.number}`}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => onDeleteNote(note.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Excluir anotação"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
