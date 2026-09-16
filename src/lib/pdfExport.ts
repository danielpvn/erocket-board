import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BoardState } from '@/types/board';
import { calculateOverallStats, calculateSprintStats, getSprintScheduleStatus } from './dateUtils';

const STATUS_LABELS: Record<string, string> = {
  done: '[Concluída]',
  in_progress: '[Em Andamento]',
  todo: '[A Fazer]',
};

const CATEGORY_LABELS: Record<string, string> = {
  backend: 'Backend',
  frontend: 'Frontend',
  funcionalidade: 'Funcionalidade',
  entregavel: 'Entregável',
  migracao: 'Migração',
  testes: 'Testes / QA',
  geral: 'Geral',
};

const NOTE_TYPE_LABELS: Record<string, string> = {
  question_client: 'Dúvida Cliente',
  improvement: 'Melhoria',
  bug: 'Bug / Ajuste',
  general: 'Geral',
};

export function exportBoardToPdf(state: BoardState): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const stats = calculateOverallStats(state.sprints);
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timeFormatted = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // --- CABEÇALHO DO RELATÓRIO ---
  // Barra de destaque superior
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 0, pageWidth, 5, 'F');

  let currentY = 16;

  // Título e Subtítulo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('Relatório de Sprints & Roadmap', margin, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('Mentoria de Lei Seca • eRocket Board', margin, currentY);

  // Data no canto superior direito
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Gerado em: ${dateFormatted} às ${timeFormatted}`, pageWidth - margin, currentY - 6, { align: 'right' });

  currentY += 8;

  // --- CARDS DE MÉTRICAS / KPIS ---
  const cardWidth = (contentWidth - 6) / 3;
  const cardHeight = 22;

  // Card 1: Progresso MVP
  doc.setFillColor(254, 243, 199); // amber-100
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14); // amber-800
  doc.text('PROGRESSO MVP (S1 a S6)', margin + 3.5, currentY + 6);
  doc.setFontSize(14);
  doc.text(`${stats.mvp.percent}%`, margin + 3.5, currentY + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9);
  doc.text(`${stats.mvp.done}/${stats.mvp.total} tarefas concluídas`, margin + 3.5, currentY + 19);

  // Card 2: Progresso Geral
  const card2X = margin + cardWidth + 3;
  doc.setFillColor(209, 250, 229); // emerald-100
  doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(6, 95, 70); // emerald-800
  doc.text('PLATAFORMA COMPLETA', card2X + 3.5, currentY + 6);
  doc.setFontSize(14);
  doc.text(`${stats.total.percent}%`, card2X + 3.5, currentY + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(4, 120, 87);
  doc.text(`${stats.total.done}/${stats.total.total} tarefas • ${stats.totalSprints} Sprints`, card2X + 3.5, currentY + 19);

  // Card 3: Cronograma / Prazos
  const card3X = card2X + cardWidth + 3;
  const hasDelay = stats.delayedSprintsCount > 0;
  if (hasDelay) {
    doc.setFillColor(254, 226, 226); // red-100
  } else {
    doc.setFillColor(241, 245, 249); // slate-100
  }
  doc.roundedRect(card3X, currentY, cardWidth, cardHeight, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  if (hasDelay) {
    doc.setTextColor(153, 27, 27);
  } else {
    doc.setTextColor(51, 65, 85);
  }
  doc.text('SAÚDE DO CRONOGRAMA', card3X + 3.5, currentY + 6);
  doc.setFontSize(11);
  const schedText = hasDelay ? `${stats.delayedSprintsCount} Sprint(s) Atrasada(s)` : 'Cronograma em Dia';
  doc.text(schedText, card3X + 3.5, currentY + 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Ciclo: 2 semanas / sprint', card3X + 3.5, currentY + 19);

  currentY += cardHeight + 8;

  // --- SEÇÃO 1: RESUMO DO CRONOGRAMA ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Visão Geral das Sprints', margin, currentY);
  currentY += 3;

  const summaryTableRows = state.sprints.map((sprint) => {
    const sStats = calculateSprintStats(sprint);
    const schedule = getSprintScheduleStatus(sprint);
    return [
      sprint.title,
      sprint.customDateLabel || `${sprint.durationWeeks || 2} sem`,
      sprint.isMvp ? 'Sim (MVP)' : 'Fase 2',
      `${sStats.done}/${sStats.total} (${sStats.percent}%)`,
      schedule.label,
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Sprint / Foco', 'Período', 'Escopo', 'Progresso', 'Status do Prazo']],
    body: summaryTableRows,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 55, fontStyle: 'bold' },
      1: { cellWidth: 32 },
      2: { cellWidth: 22 },
      3: { cellWidth: 28 },
      4: { cellWidth: 45 },
    },
  });

  // Atualiza currentY após a tabela de resumo
  currentY = (doc as any).lastAutoTable.finalY + 10;

  // --- SEÇÃO 2: DETALHAMENTO DE CADA SPRINT ---
  if (currentY > pageHeight - 40) {
    doc.addPage();
    currentY = 16;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Detalhamento das Atividades por Sprint', margin, currentY);
  currentY += 6;

  state.sprints.forEach((sprint) => {
    const sStats = calculateSprintStats(sprint);
    const schedule = getSprintScheduleStatus(sprint);

    if (currentY > pageHeight - 45) {
      doc.addPage();
      currentY = 16;
    }

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, currentY, contentWidth, 12, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(sprint.title, margin + 3, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const sprintInfo = `${sprint.customDateLabel || ''}  |  ${sStats.done}/${sStats.total} Concluídas (${sStats.percent}%)  |  ${schedule.label}${sprint.isMvp ? '  [MVP]' : ''}`;
    doc.text(sprintInfo, margin + 3, currentY + 9.5);

    currentY += 14;

    const taskRows = sprint.tasks.map((task) => {
      const statusLabel = STATUS_LABELS[task.status] || task.status;
      const catLabel = CATEGORY_LABELS[task.category] || task.category;
      const notes = task.notes ? `\nObs: ${task.notes}` : '';

      return [
        statusLabel,
        `${task.title}${notes}`,
        catLabel,
        task.assignedTo || 'Geral',
      ];
    });

    if (taskRows.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [['Status', 'Atividade / Descrição', 'Categoria', 'Responsável']],
        body: taskRows,
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 7.5,
          cellPadding: 2,
          textColor: [30, 41, 59],
          lineColor: [226, 232, 240],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [51, 65, 85],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { cellWidth: 28, fontStyle: 'bold' },
          1: { cellWidth: 96 },
          2: { cellWidth: 30 },
          3: { cellWidth: 28 },
        },
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;
    } else {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Nenhuma atividade cadastrada nesta sprint.', margin + 3, currentY + 3);
      currentY += 10;
    }
  });

  // --- SEÇÃO 3: BACKLOG / NOTAS RÁPIDAS (SE HOUVER) ---
  if (state.quickNotes && state.quickNotes.length > 0) {
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 16;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('3. Backlog Lateral & Dúvidas Rápidas', margin, currentY);
    currentY += 5;

    const noteRows = state.quickNotes.map((note) => {
      const typeLabel = NOTE_TYPE_LABELS[note.type] || note.type;
      const statusLabel = note.status === 'resolved' ? '[Resolvido]' : '[Aberto]';
      const desc = note.description ? `\n${note.description}` : '';
      return [
        statusLabel,
        typeLabel,
        `${note.title}${desc}`,
        note.priority ? note.priority.toUpperCase() : 'MÉDIA',
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['Status', 'Tipo', 'Título / Descrição', 'Prioridade']],
      body: noteRows,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        textColor: [30, 41, 59],
        lineColor: [226, 232, 240],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [51, 65, 85],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 25, fontStyle: 'bold' },
        1: { cellWidth: 32 },
        2: { cellWidth: 100 },
        3: { cellWidth: 25 },
      },
    });
  }

  // --- RODAPÉ EM TODAS AS PÁGINAS ---
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 9, pageWidth - margin, pageHeight - 9);

    doc.text(
      'eRocket Board • Mentoria de Lei Seca • Relatório Executivo de Desenvolvimento',
      margin,
      pageHeight - 5
    );
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth - margin,
      pageHeight - 5,
      { align: 'right' }
    );
  }

  const dateStr = now.toISOString().split('T')[0];
  doc.save(`erocket-board-relatorio-sprints-${dateStr}.pdf`);
}
