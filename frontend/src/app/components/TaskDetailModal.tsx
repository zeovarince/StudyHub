import { X, CalendarDays, Clock, Paperclip, Trash2, CheckCircle } from 'lucide-react';
import { type Task, colors, getDaysUntil, formatDate, MEMBER_COLORS } from '../types';

interface TaskDetailModalProps {
  task: Task;
  isDark: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onMarkDone: () => void;
}

const STATUS_STYLE: Record<Task['status'], { bg: string; text: string; label: string }> = {
  Belum: { bg: 'rgba(100,116,139,0.1)', text: '#64748B', label: 'Belum' },
  Proses: { bg: 'rgba(14,165,233,0.1)', text: '#0EA5E9', label: 'Proses' },
  Selesai: { bg: 'rgba(16,185,129,0.1)', text: '#10B981', label: 'Selesai' },
};

export function TaskDetailModal({ task, isDark, onClose, onDelete, onMarkDone }: TaskDetailModalProps) {
  const c = colors(isDark);
  const days = getDaysUntil(task.deadline);
  const isWarning = days <= 1;
  const st = STATUS_STYLE[task.status];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '360px',
          background: c.card,
          border: `0.5px solid ${c.cardBorder}`,
          borderRadius: '12px',
          padding: '16px',
          fontFamily: 'Outfit, sans-serif',
          position: 'relative',
        }}
      >
        {/* Top row: Status badge + Close */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              fontSize: '11px',
              color: st.text,
              background: st.bg,
              borderRadius: '20px',
              padding: '3px 10px',
            }}
          >
            {st.label}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: c.muted,
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 600,
            fontSize: '15px',
            color: c.text,
            margin: '0 0 8px 0',
            lineHeight: 1.4,
          }}
        >
          {task.title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 400,
            fontSize: '13px',
            color: c.muted,
            margin: '0 0 16px 0',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task.description}
        </p>

        {/* Divider */}
        <div style={{ height: '1px', background: c.divider, marginBottom: '12px' }} />

        {/* Deadline row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 400,
              fontSize: '12px',
              color: c.muted,
            }}
          >
            <CalendarDays size={14} color="#64748B" />
            {formatDate(task.deadline)}
          </span>
          {isWarning && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: '12px',
                color: '#EF4444',
              }}
            >
              <Clock size={14} color="#EF4444" />
              {days === 0 ? 'Hari ini' : days < 0 ? 'Terlambat' : 'H-1'}
            </span>
          )}
        </div>

        {/* Collaborators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {task.members.slice(0, 3).map((m, i) => (
              <div
                key={m}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: MEMBER_COLORS[m] || '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 600,
                  fontSize: '11px',
                  border: `2px solid ${c.card}`,
                  marginLeft: i > 0 ? '-8px' : '0',
                  zIndex: task.members.length - i,
                  position: 'relative',
                }}
              >
                {m}
              </div>
            ))}
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '12px', color: c.muted }}>
            {task.members.length} anggota
          </span>
        </div>

        {/* File Attachment */}
        {task.file && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: isDark ? '#27272A' : '#F1F5F9',
              borderRadius: '6px',
              padding: '8px 10px',
              marginBottom: '16px',
            }}
          >
            <Paperclip size={13} color="#64748B" />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '12px', color: c.muted }}>
              {task.file}
            </span>
          </div>
        )}
        {!task.file && <div style={{ marginBottom: '16px' }} />}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {task.status !== 'Selesai' && (
            <button
              onClick={() => { onMarkDone(); onClose(); }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#FFFFFF',
                background: '#0EA5E9',
                border: 'none',
                borderRadius: '8px',
                padding: '10px',
                cursor: 'pointer',
                height: '40px',
              }}
            >
              <CheckCircle size={14} />
              Tandai Selesai
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            style={{
              flex: task.status === 'Selesai' ? 1 : 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              fontSize: '13px',
              color: '#EF4444',
              background: 'none',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              padding: '10px 14px',
              cursor: 'pointer',
              height: '40px',
              whiteSpace: 'nowrap',
            }}
          >
            <Trash2 size={14} />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
