import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Erocket Board — Mentoria Lei Seca',
  description: 'Quadro inteligente de gestão de Sprints, tarefas, entregáveis e backlog da Mentoria Lei Seca.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased transition-colors">
        {children}
      </body>
    </html>
  );
}
