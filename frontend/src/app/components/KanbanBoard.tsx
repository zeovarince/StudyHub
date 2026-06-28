import { CalendarDays, AlertTriangle, Plus } from 'lucide-react';
import { type Task, colors, getDaysUntil, formatDate, MEMBER_COLORS } from '../types';

interface KanbanBoardProps {
  tasks: Task[];
  isDark: boolean;
  onMoveTask: (id: string, direction: 'forward' | 'backward') => void;
  onSelectTask: (task: Task) => void;
  onAddTask: () => void;
}

const COLUMNS: { key: Task['status']; label: string; color: string }[] = [
  { key: 'Belum', label: 'Belum', color: '#64748B' },
  { key: 'Proses', label: 'Proses', color: '#0EA5E9' },
  { key: 'Selesai', label: 'Selesai', color: '#10B981' },
];

function TaskCard({
  task,
  isDark,
  onMove,
  onClick,
}: {
  task: Task;
  isDark: boolean;
  onMove: (direction: 'forward' | 'backward') => void;
  onClick: () => void;
}) {
  const c = colors(isDark);
  const days = getDaysUntil(task.deadline);
  const isWarning = days <= 1;

  return (
    <div
      onClick={onClick}
      style={{ background: c.card, border: `0.5px solid ${c.cardBorder}`, borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', marginBottom: '8px' }}
    >
      <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '13px', color: c.text, marginBottom: '4px', lineHeight: 1.4 }}>
        {task.title}
      </div>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 400, fontSize: '12px', color: c.muted, marginBottom: '10px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {task.description}
      </div>
      {task.members.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '10px' }}>
          {task.members.slice(0, 3).map((m, i) => (
            <div key={m} style={{ width: '22px', height: '22px', borderRadius: '50%', background: MEMBER_COLORS[m] || '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '9px', fontWeight: 600, border: `2px solid ${c.colBg}`, marginLeft: i > 0 ? '-6px' : '0', zIndex: task.members.length - i, position: 'relative', fontFamily: 'Outfit, sans-serif' }}>
              {m.slice(0, 2)}
            </div>
          ))}
          {task.members.length > 3 && (
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: isDark ? '#3F3F46' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.muted, fontSize: '9px', fontWeight: 600, border: `2px solid ${c.colBg}`, marginLeft: '-6px', zIndex: 0, position: 'relative', fontFamily: 'Outfit, sans-serif' }}>
              +{task.members.length - 3}
            </div>
          )}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: isWarning ? '#EF4444' : c.muted, background: isWarning ? 'rgba(239,68,68,0.07)' : (isDark ? '#3F3F46' : '#F1F5F9'), border: isWarning ? '1px solid rgba(239,68,68,0.25)' : 'none', borderRadius: '6px', padding: '3px 8px', fontWeight: isWarning ? 600 : 400 }}>
            {isWarning ? <AlertTriangle size={11} /> : <CalendarDays size={11} />}
            {formatDate(task.deadline)}
          </span>
          {task.file && (
            <span style={{ fontSize: '11px', color: c.muted, background: isDark ? '#3F3F46' : '#F1F5F9', borderRadius: '6px', padding: '3px 8px' }}>📎</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
          {task.status !== 'Belum' && (
            <button onClick={() => onMove('backward')} style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '11px', color: c.muted, background: isDark ? '#3F3F46' : '#F1F5F9', border: 'none', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {task.status === 'Proses' ? '← Belum' : '← Proses'}
            </button>
          )}
          {task.status !== 'Selesai' && (
            <button onClick={() => onMove('forward')} style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '11px', color: '#FFFFFF', background: '#0EA5E9', border: 'none', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {task.status === 'Belum' ? '→ Proses' : '→ Selesai'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function KanbanBoard({ tasks, isDark, onMoveTask, onSelectTask, onAddTask }: KanbanBoardProps) {
  const c = colors(isDark);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        .kanban-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 767px) {
          .kanban-columns {
            grid-template-columns: 1fr !important;
            gap: 12px;
          }
          .kanban-col-scroll {
            max-height: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', color: c.text, margin: 0 }}>
            Manajemen Tugas
          </h1>
          <p style={{ color: c.muted, fontSize: '13px', margin: '4px 0 0 0', fontWeight: 400 }}>
            {tasks.length} tugas total — kelola semua tugasmu di sini
          </p>
        </div>
        <button
          onClick={onAddTask}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '13px', color: '#FFFFFF', background: '#0EA5E9', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          <Plus size={16} />
          Tambah Tugas
        </button>
      </div>

      {/* Columns */}
      <div className="kanban-columns">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key);
          return (
            <div key={col.key} style={{ background: c.colBg, borderRadius: '12px', padding: '16px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: `1px solid ${c.divider}` }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '13px', color: col.color }}>
                  {col.label}
                </span>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '12px', color: col.color, background: c.card, borderRadius: '20px', padding: '2px 8px' }}>
                  {colTasks.length}
                </span>
              </div>
              <div className="kanban-col-scroll">
                {colTasks.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: c.muted, fontSize: '12px', fontStyle: 'italic' }}>
                    Tidak ada tugas
                  </div>
                ) : (
                  colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isDark={isDark}
                      onMove={dir => onMoveTask(task.id, dir)}
                      onClick={() => onSelectTask(task)}
                    />
                  ))
                )}
              </div>
              <button
                onClick={onAddTask}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'Outfit, sans-serif', fontWeight: 400, fontSize: '12px', color: c.muted, background: 'none', border: `1px dashed ${isDark ? '#3F3F46' : '#CBD5E1'}`, borderRadius: '6px', padding: '8px', cursor: 'pointer', marginTop: '4px' }}
              >
                <Plus size={12} />
                Tambah tugas
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}