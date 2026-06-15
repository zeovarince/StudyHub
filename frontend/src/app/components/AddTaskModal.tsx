import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { type Task, colors } from '../types';

interface AddTaskModalProps {
  isDark: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id'>) => void;
}

export function AddTaskModal({ isDark, onClose, onAdd }: AddTaskModalProps) {
  const c = colors(isDark);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<Task['status']>('Belum');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Judul tugas wajib diisi';
    if (!deadline) e.deadline = 'Deadline wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onAdd({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
      members: ['AL'],
      file: fileName || undefined,
    });
  };

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    color: c.text,
    background: c.inputBg,
    border: `1px solid ${hasError ? '#EF4444' : c.inputBorder}`,
    borderRadius: '8px',
    padding: '9px 12px',
    outline: 'none',
    boxSizing: 'border-box',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    color: c.muted,
    marginBottom: '6px',
  };

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
          width: '400px',
          background: c.card,
          borderRadius: '16px',
          padding: '20px',
          fontFamily: 'Outfit, sans-serif',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              color: c.text,
              margin: 0,
            }}
          >
            Tugas Baru
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: c.muted,
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Judul Tugas */}
          <div>
            <label style={labelStyle}>Judul Tugas</label>
            <input
              type="text"
              placeholder="Contoh: UAS Pemrograman Web"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={inputStyle(!!errors.title)}
            />
            {errors.title && (
              <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                {errors.title}
              </span>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label style={labelStyle}>Deskripsi</label>
            <textarea
              placeholder="Deskripsikan tugasmu..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{
                ...inputStyle(),
                resize: 'vertical',
                fontFamily: 'Outfit, sans-serif',
              }}
            />
          </div>

          {/* Deadline */}
          <div>
            <label style={labelStyle}>Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              style={{
                ...inputStyle(!!errors.deadline),
                colorScheme: isDark ? 'dark' : 'light',
              }}
            />
            {errors.deadline && (
              <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                {errors.deadline}
              </span>
            )}
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle}>Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as Task['status'])}
              style={{
                ...inputStyle(),
                cursor: 'pointer',
                appearance: 'auto',
              }}
            >
              <option value="Belum">Belum</option>
              <option value="Proses">Proses</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          {/* Upload File */}
          <div>
            <label style={labelStyle}>Upload File (opsional)</label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) setFileName(file.name);
              }}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) setFileName(file.name);
                };
                input.click();
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: `1px dashed ${dragOver ? '#0EA5E9' : c.inputBorder}`,
                borderRadius: '8px',
                padding: '20px',
                cursor: 'pointer',
                background: dragOver ? 'rgba(14,165,233,0.04)' : c.inputBg,
                transition: 'all 0.15s',
              }}
            >
              <Upload size={20} color={dragOver ? '#0EA5E9' : '#64748B'} />
              {fileName ? (
                <span style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 500 }}>{fileName}</span>
              ) : (
                <span style={{ fontSize: '13px', color: c.muted, textAlign: 'center' }}>
                  Klik atau drag file PDF/gambar
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            color: '#FFFFFF',
            background: '#0EA5E9',
            border: 'none',
            borderRadius: '8px',
            height: '40px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Buat Tugas
        </button>
      </div>
    </div>
  );
}
