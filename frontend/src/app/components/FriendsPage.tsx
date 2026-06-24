import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserPlus, Users } from 'lucide-react';
import { colors, MEMBER_COLORS } from '../types';

interface Friend {
  initials: string;
  name: string;
  email: string;
  status: 'online' | 'studying' | 'offline';
  activity?: string;
}

interface StudyGroup {
  id: string;
  name: string;
  members: string[];
  tasks: number;
  subject: string;
}

// Grup masih dummy karena kita belum buat API Grup di backend
const GROUPS: StudyGroup[] = [
  { id: '1', name: 'Tim Pemweb', members: ['AL', 'BI', 'CI'], tasks: 3, subject: 'Pemrograman Web' },
  { id: '2', name: 'Kelompok Matematika', members: ['AL', 'BI'], tasks: 1, subject: 'Matematika' },
];

const STATUS_CONFIG = {
  online: { label: 'Online', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  studying: { label: 'Sedang belajar', color: '#0EA5E9', bg: 'rgba(14,165,233,0.1)' },
  offline: { label: 'Offline', color: '#64748B', bg: 'rgba(100,116,139,0.1)' },
};

interface FriendsPageProps {
  isDark: boolean;
}

export function FriendsPage({ isDark }: FriendsPageProps) {
  const c = colors(isDark);
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]); // State untuk data teman dari MySQL

  // 1. Tarik Data Teman dari Backend
  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/friends', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ubah format database menjadi format UI React
      const realFriends = response.data.data.map((f: any) => ({
        initials: f.nama_lengkap.substring(0, 2).toUpperCase(),
        name: f.nama_lengkap,
        email: f.email,
        status: 'online', // Default online untuk teman yang berhasil ditarik
      }));
      
      setFriends(realFriends);
    } catch (error) {
      console.error('Gagal memuat teman:', error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // 2. Fungsi Tambah Teman
  const handleAddFriend = async () => {
    const emailTeman = prompt('Masukkan email teman yang ingin ditambahkan:');
    if (!emailTeman) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/friends/add', 
        { email_teman: emailTeman },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Teman berhasil ditambahkan!');
      fetchFriends(); // Refresh daftar teman
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal menambahkan teman');
    }
  };

  const filtered = friends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase())
  );

  const online = filtered.filter(f => f.status !== 'offline');
  const offline = filtered.filter(f => f.status === 'offline');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', fontFamily: 'Outfit, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', color: c.text, margin: '0 0 4px 0' }}>
            Teman Belajar
          </h1>
          <p style={{ color: c.muted, fontSize: '13px', margin: 0 }}>
            {friends.length} teman terhubung
          </p>
        </div>
        <button
          onClick={handleAddFriend}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '13px',
            color: '#FFFFFF', background: '#0EA5E9', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer',
          }}
        >
          <UserPlus size={15} />
          Tambah Teman
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
        {/* Friends List */}
        <div>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari teman berdasarkan nama atau email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', height: '40px', fontFamily: 'Outfit, sans-serif', fontWeight: 400, fontSize: '14px',
                color: c.text, background: c.card, border: `1px solid ${c.inputBorder}`, borderRadius: '8px',
                padding: '0 12px 0 38px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Daftar Teman */}
          {online.length === 0 ? (
             <p style={{ color: c.muted, fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>Belum ada teman. Klik "Tambah Teman" di atas!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {online.map(friend => {
                const st = STATUS_CONFIG[friend.status];
                return (
                  <div key={friend.email} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: c.card, border: `0.5px solid ${c.cardBorder}`, borderRadius: '10px', padding: '12px 16px' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: MEMBER_COLORS[friend.initials] || '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '13px' }}>
                        {friend.initials}
                      </div>
                      <span style={{ position: 'absolute', bottom: '1px', right: '1px', width: '10px', height: '10px', borderRadius: '50%', background: st.color, border: `2px solid ${c.card}` }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: '14px', color: c.text }}>{friend.name}</div>
                      <div style={{ fontSize: '12px', color: c.muted, marginTop: '2px' }}>{friend.email}</div>
                    </div>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '11px', color: st.color, background: st.bg, borderRadius: '6px', padding: '3px 8px', flexShrink: 0 }}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Study Groups (Tetap Statis) */}
        <div style={{ background: c.card, border: `0.5px solid ${c.cardBorder}`, borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Users size={16} color="#0EA5E9" />
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '14px', color: c.text, margin: 0 }}>Grup Studi</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {GROUPS.map(group => (
              <div key={group.id} style={{ background: isDark ? '#27272A' : '#F8FAFC', borderRadius: '8px', padding: '12px', cursor: 'pointer', border: `0.5px solid ${c.cardBorder}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '13px', color: c.text }}>{group.name}</div>
                    <div style={{ fontSize: '12px', color: c.muted, marginTop: '2px' }}>{group.subject}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '11px', color: c.muted, marginLeft: '6px' }}>{group.members.length} anggota</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}