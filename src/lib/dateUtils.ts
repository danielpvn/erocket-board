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

  return {
    mvp: calc(mvpTasks),
    total: calc(allTasks),
    totalSprints: sprints.length,
    mvpSprintsCount: mvpSprints.length,
  };
}
