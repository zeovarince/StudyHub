import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bot, X, Send, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { colors } from '../types';
import { API_URL, SOCKET_URL } from '../config';

// ============================================================
// INTERFACES
// ============================================================
interface ChatMessage {
  id_chat?: number;
  role: 'user' | 'assistant';
  message: string;
  created_at?: string;
}

interface ChatWidgetProps {
  isDark: boolean;
}

// ============================================================
// HELPERS
// ============================================================
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
};

const SUGGESTIONS = [
  'Tugas aku apa aja yang belum kelar?',
  'Tugas mana yang deadline-nya paling dekat?',
  'Ada tugas yang udah lewat deadline?',
];

// ============================================================
// KOMPONEN UTAMA
// ============================================================
export function ChatWidget({ isDark }: ChatWidgetProps) {
  const c = colors(isDark);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke bawah tiap ada pesan baru / saat sedang "mengetik"
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Ambil riwayat chat sekali aja, saat panel pertama kali dibuka
  useEffect(() => {
    if (isOpen && !hasLoadedHistory) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await axios.get(`${API_URL}/api/chat/history`, getAuthHeader());
      setMessages(
        res.data.data.map((m: any) => ({
          id_chat: m.id_chat,
          role: m.role,
          message: m.message,
          created_at: m.created_at,
        }))
      );
    } catch (error) {
      console.error('Gagal memuat riwayat chat:', error);
    } finally {
      setIsLoadingHistory(false);
      setHasLoadedHistory(true);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || isSending) return;

    // Optimistic UI: tampilkan pesan user duluan sebelum response AI datang
    setMessages(prev => [...prev, { role: 'user', message: text }]);
    setInput('');
    setIsSending(true);

    try {
      const res = await axios.post(`${API_URL}/api/chat`, { message: text }, getAuthHeader());
      setMessages(prev => [...prev, { role: 'assistant', message: res.data.reply }]);
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || 'Maaf, StudyBot sedang gangguan. Coba lagi sebentar ya.';
      setMessages(prev => [...prev, { role: 'assistant', message: errMsg }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await axios.delete(`${API_URL}/api/chat/history`, getAuthHeader());
      setMessages([]);
    } catch (error) {
      console.error('Gagal menghapus riwayat chat:', error);
    }
  };

  return (
    <>
      {/* Bubble pojok kanan bawah — selalu muncul di semua halaman */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#0EA5E9',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(14,165,233,0.45)',
          zIndex: 1500,
          color: '#fff',
        }}
        aria-label={isOpen ? 'Tutup StudyBot' : 'Buka StudyBot'}
      >
        {isOpen ? <X size={24} /> : <Bot size={26} />}
      </button>

      {/* Panel chat */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '92px',
            right: '24px',
            width: '360px',
            height: '500px',
            maxHeight: 'calc(100vh - 120px)',
            background: c.card,
            border: `1px solid ${c.cardBorder}`,
            borderRadius: '16px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.22)',
            zIndex: 1500,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'Outfit, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 16px',
              borderBottom: `1px solid ${c.divider}`,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: isDark ? '#18181B' : '#F8FAFC',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#0EA5E9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={16} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: c.text }}>
                StudyBot
              </div>
              <div style={{ fontSize: '11px', color: c.muted }}>Asisten tugas kamu</div>
            </div>
            <button
              onClick={handleClearHistory}
              title="Hapus riwayat chat"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.muted, padding: '4px', flexShrink: 0 }}
            >
              <Trash2 size={15} />
            </button>
          </div>

          {/* Daftar pesan */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isLoadingHistory ? (
              <div style={{ margin: 'auto', color: c.muted, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Loader2 size={14} className="animate-spin" /> Memuat riwayat...
              </div>
            ) : messages.length === 0 ? (
              <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '280px' }}>
                <p style={{ color: c.muted, fontSize: '13px', marginBottom: '12px', lineHeight: '1.5' }}>
                  Hai! Aku StudyBot 👋 Tanya apa aja soal tugas kamu, atau hal umum lainnya.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      style={{
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${c.inputBorder}`,
                        background: c.inputBg,
                        color: c.text,
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontFamily: 'Outfit, sans-serif',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={m.id_chat ?? i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '8px 12px',
                      borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                      background: m.role === 'user' ? '#0EA5E9' : isDark ? '#27272A' : '#F1F5F9',
                      color: m.role === 'user' ? '#fff' : c.text,
                      fontSize: '13px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {m.message}
                  </div>
                </div>
              ))
            )}

            {isSending && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px 12px 12px 4px',
                    background: isDark ? '#27272A' : '#F1F5F9',
                    color: c.muted,
                    fontSize: '13px',
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                  }}
                >
                  <Loader2 size={13} className="animate-spin" /> mengetik...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input kirim pesan */}
          <div style={{ padding: '10px 12px', borderTop: `1px solid ${c.divider}`, display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            <input
              placeholder="Tanya StudyBot..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={isSending}
              style={{
                flex: 1,
                height: '38px',
                borderRadius: '10px',
                border: `1px solid ${c.inputBorder}`,
                background: c.inputBg,
                color: c.text,
                padding: '0 12px',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isSending}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: input.trim() && !isSending ? '#0EA5E9' : isDark ? '#27272A' : '#E2E8F0',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() && !isSending ? 'pointer' : 'default',
                color: input.trim() && !isSending ? '#fff' : c.muted,
                flexShrink: 0,
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
