export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'Belum' | 'Proses' | 'Selesai';
  members: string[];
  file?: string;
}

export type Page = 'Dashboard' | 'Tugas' | 'Teman' | 'Musik' | 'Profil';

export const MEMBER_COLORS: Record<string, string> = {
  AL: '#0EA5E9',
  BI: '#F97316',
  CI: '#10B981',
  DI: '#8B5CF6',
  EV: '#EC4899',
  FA: '#F59E0B',
  GI: '#06B6D4',
};

export const getDaysUntil = (deadline: string): number => {
  const today = new Date('2026-06-15T00:00:00');
  const d = new Date(deadline + 'T00:00:00');
  return Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const colors = (isDark: boolean) => ({
  bg: isDark ? '#09090B' : '#F8FAFC',
  card: isDark ? '#18181B' : '#FFFFFF',
  text: isDark ? '#FAFAFA' : '#0F172A',
  muted: isDark ? '#A1A1AA' : '#64748B',
  colBg: isDark ? '#27272A' : '#F1F5F9',
  navBg: isDark ? '#18181B' : '#FFFFFF',
  inputBg: isDark ? '#27272A' : '#F8FAFC',
  inputBorder: isDark ? '#3F3F46' : '#E2E8F0',
  divider: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
  cardBorder: 'rgba(15,23,42,0.08)',
  navBorder: isDark ? 'rgba(250,250,250,0.08)' : 'rgba(15,23,42,0.08)',
});
