import React, { useState } from 'react';
import { parseImportedJson } from '@/lib/storage';
import { BoardState } from '@/types/board';
import { X, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ImportJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedState: BoardState) => void;
}

export const ImportJsonModal: React.FC<ImportJsonModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [previewState, setPreviewState] = useState<BoardState | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonText(content);
      validateAndPreview(content);
    };
    reader.readAsText(file);
  };

  const validateAndPreview = (text: string) => {
    setErrorMsg('');
    setPreviewState(null);
    if (!text.trim()) return;

    try {
      const parsed = parseImportedJson(text);
      setPreviewState(parsed);
    } catch (err: any) {
      setErrorMsg(err.message || 'Arquivo JSON inválido.');
    }
  };

  const handleTextChange = (text: string) => {
    setJsonText(text);
    validateAndPreview(text);
  };

  const handleConfirmImport = () => {
    if (!previewState) return;
    onImportSuccess(previewState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Importar Backup do Board
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

        <div className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Escolher arquivo .json do seu computador
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-xs uppercase font-semibold">Ou cole o JSON</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <div>
            <textarea
              rows={4}
              value={jsonText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Cole aqui o conteúdo JSON exportado anteriormente..."
              className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 text-xs flex items-start gap-2 border border-rose-200 dark:border-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {previewState && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 text-xs flex items-center justify-between border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>JSON Válido:</strong> {previewState.sprints.length} Sprints e {previewState.quickNotes.length} Anotações encontradas.
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!previewState}
              onClick={handleConfirmImport}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-primary/20 transition-all cursor-pointer"
            >
              Confirmar e Restaurar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
