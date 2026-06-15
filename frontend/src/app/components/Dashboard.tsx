import { CalendarDays, CheckCircle2, Clock3, ListTodo, AlertCircle } from 'lucide-react';
import { type Task, colors, getDaysUntil, formatDate, MEMBER_COLORS } from '../types';

interface DashboardProps {
  tasks: Task[];
  isDark: boolean;
}

const statCards = (tasks: Task[]) => [
  {
    label: 'Total Tugas',
    value: tasks.length,
    icon: ListTodo,
    accent: '#0EA5E9',
    bg: 'rgba(14,165,233,0.08)',
  },
  {
    label: 'Belum Dikerjakan',
    value: tasks.filter(t => t.status === 'Belum').length,
    icon: Clock3,
    accent: '#64748B',
    bg: 'rgba(100,116,139,0.08)',
  },
  {
    label: 'Sedang Proses',
    value: tasks.filter(t => t.status === 'Proses').length,
    icon: AlertCircle,
    accent: '#F97316',
    bg: 'rgba(249,115,22,0.08)',
  },
  {
    label: 'Selesai',
    value: tasks.filter(t => t.status === 'Selesai').length,
    icon: CheckCircle2,
    accent: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
  },
];

export function Dashboard({ tasks, isDark }: DashboardProps) {
  const c = colors(isDark);

  const upcoming = tasks
    .filter(t => t.status !== 'Selesai')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 6);

  const completedPct =
    tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Selesai').length / tasks.length) * 100) : 0;

  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '32px 24px',
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      {/* Welcome */}
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            color: c.text,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          Selamat Datang, Arkan
        </h1>
        <p style={{ color: c.muted, fontSize: '14px', margin: '4px 0 0 0', fontWeight: 400 }}>
          Senin, 15 Juni 2026 — Tetap semangat hari ini!
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {statCards(tasks).map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                background: c.card,
                border: `0.5px solid ${c.cardBorder}`,
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={20} color={stat.accent} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: '26px',
                    color: c.text,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ color: c.muted, fontSize: '13px', marginTop: '3px', fontWeight: 400 }}>
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>
        {/* Upcoming Deadlines */}
        <div
          style={{
            background: c.card,
            border: `0.5px solid ${c.cardBorder}`,
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h3
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              color: c.text,
              margin: '0 0 16px 0',
            }}
          >
            Deadline Terdekat
          </h3>
          {upcoming.length === 0 ? (
            <p style={{ color: c.muted, fontSize: '13px' }}>Semua tugas sudah selesai!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcoming.map(task => {
                const days = getDaysUntil(task.deadline);
                const isWarning = days <= 1;
                return (
                  <div
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      background: isDark ? '#27272A' : '#F8FAFC',
                      borderRadius: '8px',
                      borderLeft: isWarning ? '3px solid #EF4444' : `3px solid ${c.card}`,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 500,
                          fontSize: '13px',
                          color: c.text,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {task.title}
                      </div>
                      <div style={{ color: c.muted, fontSize: '11px', marginTop: '2px' }}>
                        {task.status}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          color: isWarning ? '#EF4444' : c.muted,
                          background: isWarning ? 'rgba(239,68,68,0.07)' : (isDark ? '#3F3F46' : '#F1F5F9'),
                          border: isWarning ? '1px solid rgba(239,68,68,0.25)' : 'none',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontWeight: isWarning ? 600 : 400,
                        }}
                      >
                        <CalendarDays size={11} />
                        {formatDate(task.deadline)}
                      </span>
                      {isWarning && (
                        <span
                          style={{
                            fontFamily: 'Syne, sans-serif',
                            fontWeight: 700,
                            fontSize: '10px',
                            color: '#FFFFFF',
                            background: '#EF4444',
                            borderRadius: '4px',
                            padding: '2px 6px',
                          }}
                        >
                          {days === 0 ? 'Hari ini' : days < 0 ? 'Terlambat' : 'H-1'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Progress Card */}
        <div
          style={{
            background: c.card,
            border: `0.5px solid ${c.cardBorder}`,
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              color: c.text,
              margin: '0 0 20px 0',
            }}
          >
            Progres Keseluruhan
          </h3>

          {/* Circle Progress */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '16px' }}>
              <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke={isDark ? '#27272A' : '#F1F5F9'} strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#0EA5E9"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - completedPct / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: '24px',
                    color: c.text,
                    lineHeight: 1,
                  }}
                >
                  {completedPct}%
                </span>
                <span style={{ fontSize: '11px', color: c.muted, marginTop: '2px' }}>selesai</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              {[
                { label: 'Selesai', count: tasks.filter(t => t.status === 'Selesai').length, color: '#10B981' },
                { label: 'Proses', count: tasks.filter(t => t.status === 'Proses').length, color: '#0EA5E9' },
                { label: 'Belum', count: tasks.filter(t => t.status === 'Belum').length, color: '#64748B' },
              ].map(item => (
                <div
                  key={item.label}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: item.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: '12px', color: c.muted }}>{item.label}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: c.text,
                    }}
                  >
                    {item.count} tugas
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Members */}
      <div
        style={{
          marginTop: '16px',
          background: c.card,
          border: `0.5px solid ${c.cardBorder}`,
          borderRadius: '12px',
          padding: '20px',
        }}
      >
        <h3
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            color: c.text,
            margin: '0 0 16px 0',
          }}
        >
          Anggota Aktif
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {Object.entries(MEMBER_COLORS).map(([initials, color]) => (
            <div key={initials} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                {initials}
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: c.text }}>
                  {initials === 'AL' ? 'Alicia' : initials === 'BI' ? 'Bintang' : initials === 'CI' ? 'Citra' : initials === 'DI' ? 'Dimas' : initials === 'EV' ? 'Eva' : initials === 'FA' ? 'Farhan' : 'Gita'}
                </div>
                <div style={{ fontSize: '11px', color: '#10B981' }}>Online</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
