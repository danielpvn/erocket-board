import { Sprint } from '@/types/board';

const MONTH_NAMES_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

export function formatToPtBrShort(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTH_NAMES_SHORT[date.getMonth()];
  return `${day}/${month}`;
}

export function formatDateInterval(start: Date, end: Date): string {
  return `${formatToPtBrShort(start)} — ${formatToPtBrShort(end)}`;
}

export function recalculateSprintDates(
  sprints: Sprint[],
  baseStartDateStr: string = '2026-09-01',
  defaultDurationWeeks: number = 2
): Sprint[] {
  let currentDate = new Date(baseStartDateStr + 'T00:00:00');
  if (isNaN(currentDate.getTime())) {
    currentDate = new Date();
  }

  return sprints.map((sprint, index) => {
    const weeks = sprint.durationWeeks || defaultDurationWeeks;
    const daysToAdd = weeks * 7;

    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + daysToAdd);

    currentDate = new Date(endDate);

    const calculatedLabel = formatDateInterval(startDate, endDate);

    return {
      ...sprint,
      order: index,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      customDateLabel: sprint.customDateLabel || calculatedLabel,
    };
  });
}

export function calculateSprintStats(sprint: Sprint) {
  const total = sprint.tasks.length;
  if (total === 0) {
    return { total: 0, done: 0, inProgress: 0, todo: 0, percent: 0, isCompleted: false };
  }

  const done = sprint.tasks.filter((t) => t.status === 'done').length;
  const inProgress = sprint.tasks.filter((t) => t.status === 'in_progress').length;
  const weightedScore = done + inProgress * 0.5;
  const percent = Math.round((weightedScore / total) * 100);

  return {
    total,
    done,
    inProgress,
    todo: total - done - inProgress,
    percent,
    isCompleted: done === total,
  };
}

export function calculateOverallStats(sprints: Sprint[]) {
  const mvpSprints = sprints.filter((s) => s.isMvp);
  const allTasks = sprints.flatMap((s) => s.tasks);
  const mvpTasks = mvpSprints.flatMap((s) => s.tasks);

  const calc = (tasks: typeof allTasks) => {
    const total = tasks.length;
    if (total === 0) return { total: 0, done: 0, inProgress: 0, percent: 0 };
    const done = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const percent = Math.round(((done + inProgress * 0.5) / total) * 100);
    return { total, done, inProgress, percent };
  };

  const delayedSprintsCount = sprints.filter((s) => {
    const sched = getSprintScheduleStatus(s);
    return sched.status === 'delayed';
  }).length;

  const warningSprintsCount = sprints.filter((s) => {
    const sched = getSprintScheduleStatus(s);
    return sched.status === 'warning';
  }).length;

  return {
    mvp: calc(mvpTasks),
    total: calc(allTasks),
    totalSprints: sprints.length,
    mvpSprintsCount: mvpSprints.length,
    delayedSprintsCount,
    warningSprintsCount,
  };
}

export interface SprintScheduleStatus {
  status: 'completed' | 'delayed' | 'warning' | 'in_progress' | 'future';
  daysDiff: number;
  label: string;
  badgeClass: string;
  isCurrentSprint: boolean;
}

export function getSprintScheduleStatus(sprint: Sprint): SprintScheduleStatus {
  const stats = calculateSprintStats(sprint);

  if (stats.isCompleted) {
    return {
      status: 'completed',
      daysDiff: 0,
      label: 'Concluída no Prazo',
      badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
      isCurrentSprint: false,
    };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (sprint.startDate) {
    const parts = sprint.startDate.split('-');
    if (parts.length === 3) {
      startDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }
  }

  if (sprint.endDate) {
    const parts = sprint.endDate.split('-');
    if (parts.length === 3) {
      endDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }
  }

  if (!startDate || !endDate) {
    return {
      status: stats.inProgress > 0 ? 'in_progress' : 'future',
      daysDiff: 0,
      label: stats.inProgress > 0 ? 'Em Andamento' : 'Planejada',
      badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      isCurrentSprint: stats.inProgress > 0,
    };
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilEnd = Math.round((endDate.getTime() - today.getTime()) / msPerDay);
  const daysUntilStart = Math.round((startDate.getTime() - today.getTime()) / msPerDay);

  // Se o prazo expirou e a sprint NÃO está concluída => ATRASADA
  if (daysUntilEnd < 0) {
    const daysDelayed = Math.abs(daysUntilEnd);
    return {
      status: 'delayed',
      daysDiff: daysDelayed,
      label: `Atrasada há ${daysDelayed} ${daysDelayed === 1 ? 'dia' : 'dias'}`,
      badgeClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40 font-bold',
      isCurrentSprint: true,
    };
  }

  // Se está dentro da janela de datas
  if (today >= startDate && today <= endDate) {
    if (daysUntilEnd <= 3) {
      return {
        status: 'warning',
        daysDiff: daysUntilEnd,
        label: daysUntilEnd === 0 ? 'Termina HOJE!' : `Reta final: restam ${daysUntilEnd} ${daysUntilEnd === 1 ? 'dia' : 'dias'}`,
        badgeClass: 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/40 font-semibold',
        isCurrentSprint: true,
      };
    }

    return {
      status: 'in_progress',
      daysDiff: daysUntilEnd,
      label: `Em andamento (restam ${daysUntilEnd} dias)`,
      badgeClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 font-medium',
      isCurrentSprint: true,
    };
  }

  // Se é antes da data de início
  if (daysUntilStart > 0) {
    return {
      status: 'future',
      daysDiff: daysUntilStart,
      label: `Inicia em ${daysUntilStart} ${daysUntilStart === 1 ? 'dia' : 'dias'}`,
      badgeClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
      isCurrentSprint: false,
    };
  }

  return {
    status: 'in_progress',
    daysDiff: daysUntilEnd,
    label: 'Em Andamento',
    badgeClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
    isCurrentSprint: true,
  };
}
