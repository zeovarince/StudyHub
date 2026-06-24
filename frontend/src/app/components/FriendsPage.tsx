import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import {
  Search, UserPlus, Users, X, Check, Trash2,
  Plus, Send, MessageCircle, LogOut, UserMinus
} from 'lucide-react';
import { colors } from '../types';

// ============================================================
// INTERFACES
// ============================================================
interface Friend {
  id_user: number;
  nama_lengkap: string;
  email: string;
}

interface FriendRequest {
  id_pertemanan: number;
  id_user: number;
  nama_lengkap: string;
  email: string;
  created_at: string;
}

interface SearchResult {
  id_user: number;
  nama_lengkap: string;
  email: string;
  friendship_status: 'pending' | 'accepted' | 'rejected' | null;
  requester_id: number | null;
}

interface Group {
  id_group: number;
  nama_group: string;
  deskripsi: string | null;
  owner_id: number;
  nama_owner: string;
  total_anggota: number;
}

interface GroupMember {
  id_user: number;
  nama_lengkap: string;
  email: string;
}

interface Message {
  id_message: number;
  message: string | null;
  file_url: string | null;
  file_type: string | null;
  created_at: string;
  sender_id: number;
  sender_name: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface FriendsPageProps {
  isDark: boolean;
}

// ============================================================
// HELPERS
// ============================================================
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const AVATAR_COLORS = [
  '#6366F1', '#F97316', '#10B981', '#0EA5E9',
  '#8B5CF6', '#EC4899', '#F59E0B', '#14B8A6'
];

const getAvatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

// ============================================================
// KOMPONEN UTAMA
// ============================================================
export function FriendsPage({ isDark }: FriendsPageProps) {
  const c = colors(isDark);

  // --- State: teman ---
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  // --- State: popup tambah teman ---
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // --- State: grup ---
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  // --- State: chat grup ---
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showGroupChat, setShowGroupChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- State: Socket.io ---
  const socketRef = useRef<Socket | null>(null);

  // --- State: user saat ini ---
  const [currentUserId, setCurrentUserId] = useState<number>(0);

  // --- State: toast ---
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  // ============================================================
  // TOAST
  // ============================================================
  const showToast = (message: string, type: 'success' | 'error') => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  // ============================================================
  // FETCH AWAL
  // ============================================================
  useEffect(() => {
    // Ambil id user yang login dari localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.id_user);
      } catch {}
    }
    fetchFriends();
    fetchRequests();
    fetchGroups();
  }, []);

  // Auto scroll ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup Socket.io saat buka chat grup
  useEffect(() => {
    if (!showGroupChat || !activeGroup) return;

    const token = localStorage.getItem('token');
    const socket = io('http://localhost:5000', { auth: { token } });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_group', { groupId: activeGroup.id_group });
    });

    // Terima pesan real-time
    socket.on('new_message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('error', (err: any) => {
      showToast(err.message || 'Socket error', 'error');
    });

    // Cleanup: disconnect socket saat chat ditutup
    return () => {
      socket.emit('leave_group', { groupId: activeGroup.id_group });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [showGroupChat, activeGroup]);

  // ============================================================
  // FUNGSI: TEMAN
  // ============================================================
  const fetchFriends = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/friends', getAuthHeader());
      setFriends(res.data.data);
    } catch {}
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/friends/requests', getAuthHeader());
      setRequests(res.data.data);
    } catch {}
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;
    setIsSearching(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/friends/search?q=${searchQuery}`,
        getAuthHeader()
      );
      setSearchResults(res.data.data);
    } catch {
      showToast('Gagal mencari user', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (friendId: number) => {
    try {
      await axios.post(
        'http://localhost:5000/api/friends/request',
        { friend_id: friendId },
        getAuthHeader()
      );
      showToast('Permintaan pertemanan terkirim!', 'success');
      // Update status di hasil pencarian langsung
      setSearchResults(prev => prev.map(u =>
        u.id_user === friendId
          ? { ...u, friendship_status: 'pending', requester_id: currentUserId }
          : u
      ));
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Gagal mengirim permintaan', 'error');
    }
  };

  const handleRespondRequest = async (idPertemanan: number, action: 'accept' | 'reject') => {
    try {
      await axios.put(
        `http://localhost:5000/api/friends/request/${idPertemanan}`,
        { action },
        getAuthHeader()
      );
      showToast(action === 'accept' ? 'Permintaan diterima!' : 'Permintaan ditolak', action === 'accept' ? 'success' : 'error');
      fetchRequests();
      if (action === 'accept') fetchFriends();
    } catch {
      showToast('Gagal memproses permintaan', 'error');
    }
  };

  const handleRemoveFriend = async (friendId: number, name: string) => {
    if (!window.confirm(`Hapus ${name} dari daftar teman?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/friends/${friendId}`, getAuthHeader());
      showToast(`${name} dihapus dari daftar teman`, 'error');
      fetchFriends();
    } catch {
      showToast('Gagal menghapus teman', 'error');
    }
  };

  // ============================================================
  // FUNGSI: GRUP
  // ============================================================
  const fetchGroups = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/groups', getAuthHeader());
      setGroups(res.data.data);
    } catch {}
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      await axios.post(
        'http://localhost:5000/api/groups',
        { nama_group: newGroupName, deskripsi: newGroupDesc },
        getAuthHeader()
      );
      showToast('Grup berhasil dibuat!', 'success');
      setNewGroupName('');
      setNewGroupDesc('');
      setShowCreateGroup(false);
      fetchGroups();
    } catch {
      showToast('Gagal membuat grup', 'error');
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (!window.confirm('Hapus grup ini?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/groups/${groupId}`, getAuthHeader());
      showToast('Grup dihapus', 'error');
      fetchGroups();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Gagal menghapus grup', 'error');
    }
  };

  const handleOpenGroup = async (group: Group) => {
    setActiveGroup(group);
    setShowGroupChat(true);
    try {
      const [detailRes, msgRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/groups/${group.id_group}`, getAuthHeader()),
        axios.get(`http://localhost:5000/api/groups/${group.id_group}/messages`, getAuthHeader()),
      ]);
      setGroupMembers(detailRes.data.data.anggota);
      setMessages(msgRes.data.data);
    } catch {
      showToast('Gagal memuat data grup', 'error');
    }
  };

  const handleAddMember = async (friendId: number) => {
    if (!activeGroup) return;
    try {
      await axios.post(
        `http://localhost:5000/api/groups/${activeGroup.id_group}/members`,
        { friend_id: friendId },
        getAuthHeader()
      );
      showToast('Anggota ditambahkan!', 'success');
      handleOpenGroup(activeGroup);
      setShowAddMember(false);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Gagal menambah anggota', 'error');
    }
  };

  const handleLeaveGroup = async () => {
    if (!activeGroup || !window.confirm('Keluar dari grup ini?')) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/groups/${activeGroup.id_group}/members/leave`,
        getAuthHeader()
      );
      showToast('Berhasil keluar dari grup', 'error');
      setShowGroupChat(false);
      setActiveGroup(null);
      fetchGroups();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Gagal keluar dari grup', 'error');
    }
  };

  const handleKickMember = async (memberId: number, memberName: string) => {
    if (!activeGroup || !window.confirm(`Keluarkan ${memberName} dari grup?`)) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/groups/${activeGroup.id_group}/members/${memberId}`,
        getAuthHeader()
      );
      showToast(`${memberName} dikeluarkan dari grup`, 'error');
      handleOpenGroup(activeGroup);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Gagal mengeluarkan anggota', 'error');
    }
  };

  // ============================================================
  // FUNGSI: CHAT
  // ============================================================
  const handleSendMessage = () => {
    if (!newMessage.trim() || !socketRef.current || !activeGroup) return;

    // Kirim via Socket.io (real-time)
    socketRef.current.emit('send_message', {
      groupId: activeGroup.id_group,
      message: newMessage.trim(),
    });

    setNewMessage('');
  };

  // ============================================================
  // RENDER
  // ============================================================

  // Teman yang belum masuk grup aktif (untuk dropdown add member)
  const friendsNotInGroup = friends.filter(
    f => !groupMembers.find(m => m.id_user === f.id_user)
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', fontFamily: 'Outfit, sans-serif', position: 'relative' }}>

      {/* ======================== TOAST ======================== */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{ background: toast.type === 'success' ? '#16A34A' : '#DC2626', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontFamily: 'Outfit, sans-serif', fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', maxWidth: '280px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{toast.type === 'success' ? '✓' : '✕'}</span>
            {toast.message}
          </div>
        ))}
      </div>

      {/* ======================== POPUP TAMBAH TEMAN ======================== */}
      {showSearchPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: c.card, borderRadius: '16px', padding: '24px', width: '420px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
            {/* Header popup */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: c.text }}>Tambah Teman</span>
                <p style={{ fontSize: '12px', color: c.muted, margin: '2px 0 0 0' }}>Cari berdasarkan nama lengkap</p>
              </div>
              <button onClick={() => { setShowSearchPopup(false); setSearchResults([]); setSearchQuery(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.muted, padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Search input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={15} color="#64748B" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  placeholder="Ketik nama teman..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  autoFocus
                  style={{ width: '100%', height: '40px', borderRadius: '10px', border: `1px solid ${c.inputBorder}`, background: c.inputBg, color: c.text, padding: '0 12px 0 34px', fontFamily: 'Outfit, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <button
                onClick={handleSearch}
                style={{ height: '40px', padding: '0 16px', borderRadius: '10px', background: '#0EA5E9', border: 'none', color: '#fff', fontSize: '13px', fontFamily: 'Outfit, sans-serif', fontWeight: 500, cursor: 'pointer' }}
              >
                Cari
              </button>
            </div>

            {/* Hasil pencarian */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {isSearching ? (
                <div style={{ textAlign: 'center', padding: '32px', color: c.muted, fontSize: '13px' }}>Mencari...</div>
              ) : searchResults.length === 0 && searchQuery.length > 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: c.muted, fontSize: '13px' }}>Tidak ada user ditemukan</div>
              ) : (
                searchResults.map(user => {
                  const isPending = user.friendship_status === 'pending';
                  const isAccepted = user.friendship_status === 'accepted';
                  const isSentByMe = isPending && user.requester_id === currentUserId;

                  return (
                    <div key={user.id_user} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: `1px solid ${c.divider}` }}>
                      {/* Avatar */}
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: getAvatarColor(user.id_user), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '14px', flexShrink: 0 }}>
                        {getInitials(user.nama_lengkap)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: c.text }}>{user.nama_lengkap}</div>
                        <div style={{ fontSize: '12px', color: c.muted }}>{user.email}</div>
                      </div>
                      {/* Tombol sesuai status */}
                      {isAccepted ? (
                        <span style={{ fontSize: '11px', color: '#10B981', background: 'rgba(16,185,129,0.1)', borderRadius: '6px', padding: '4px 10px', fontWeight: 500 }}>Berteman</span>
                      ) : isSentByMe ? (
                        <span style={{ fontSize: '11px', color: '#F59E0B', background: 'rgba(245,158,11,0.1)', borderRadius: '6px', padding: '4px 10px', fontWeight: 500 }}>Terkirim</span>
                      ) : isPending ? (
                        // Ada request dari user ini ke kita, bisa accept langsung dari sini
                        <button onClick={() => handleRespondRequest(user.id_user, 'accept')} style={{ fontSize: '11px', color: '#fff', background: '#10B981', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontWeight: 500 }}>
                          Terima
                        </button>
                      ) : (
                        <button onClick={() => handleSendRequest(user.id_user)} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#fff', background: '#0EA5E9', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: 500 }}>
                          <UserPlus size={13} /> Tambah
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================== MODAL BUAT GRUP ======================== */}
      {showCreateGroup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: c.card, borderRadius: '16px', padding: '24px', width: '380px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: c.text }}>Buat Grup Studi</span>
              <button onClick={() => setShowCreateGroup(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.muted }}><X size={20} /></button>
            </div>
            <input
              placeholder="Nama grup..."
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateGroup()}
              style={{ width: '100%', height: '40px', borderRadius: '10px', border: `1px solid ${c.inputBorder}`, background: c.inputBg, color: c.text, padding: '0 12px', fontFamily: 'Outfit, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box', marginBottom: '10px' }}
            />
            <input
              placeholder="Deskripsi (opsional)..."
              value={newGroupDesc}
              onChange={e => setNewGroupDesc(e.target.value)}
              style={{ width: '100%', height: '40px', borderRadius: '10px', border: `1px solid ${c.inputBorder}`, background: c.inputBg, color: c.text, padding: '0 12px', fontFamily: 'Outfit, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
            />
            <button onClick={handleCreateGroup} style={{ width: '100%', height: '40px', borderRadius: '10px', background: '#0EA5E9', border: 'none', color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              Buat Grup
            </button>
          </div>
        </div>
      )}

      {/* ======================== MODAL CHAT GRUP ======================== */}
      {showGroupChat && activeGroup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: c.card, borderRadius: '16px', width: '700px', maxWidth: '95vw', height: '80vh', display: 'flex', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>

            {/* Sidebar anggota */}
            <div style={{ width: '200px', borderRight: `1px solid ${c.divider}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <div style={{ padding: '16px', borderBottom: `1px solid ${c.divider}` }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', color: c.text, marginBottom: '2px' }}>{activeGroup.nama_group}</div>
                <div style={{ fontSize: '11px', color: c.muted }}>{groupMembers.length} anggota</div>
              </div>

              {/* Daftar anggota */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                {groupMembers.map(member => (
                  <div key={member.id_user} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: getAvatarColor(member.id_user), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 600, flexShrink: 0 }}>
                      {getInitials(member.nama_lengkap)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', color: c.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {member.nama_lengkap}
                        {member.id_user === activeGroup.owner_id && (
                          <span style={{ fontSize: '9px', color: '#0EA5E9', marginLeft: '4px' }}>owner</span>
                        )}
                      </div>
                    </div>
                    {/* Tombol kick — hanya muncul buat owner, dan bukan ke diri sendiri */}
                    {activeGroup.owner_id === currentUserId && member.id_user !== currentUserId && (
                      <button onClick={() => handleKickMember(member.id_user, member.nama_lengkap)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '1px', display: 'flex' }}>
                        <UserMinus size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Tombol aksi bawah sidebar */}
              <div style={{ padding: '12px', borderTop: `1px solid ${c.divider}`, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* Tambah anggota — hanya owner */}
                {activeGroup.owner_id === currentUserId && (
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowAddMember(!showAddMember)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '8px', background: 'rgba(14,165,233,0.1)', border: 'none', color: '#0EA5E9', fontSize: '11px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
                    >
                      <Plus size={12} /> Tambah Anggota
                    </button>
                    {/* Dropdown pilih teman */}
                    {showAddMember && (
                      <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, background: c.card, border: `1px solid ${c.cardBorder}`, borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', maxHeight: '160px', overflowY: 'auto', zIndex: 10 }}>
                        {friendsNotInGroup.length === 0 ? (
                          <div style={{ padding: '12px', fontSize: '11px', color: c.muted, textAlign: 'center' }}>Semua teman sudah di grup</div>
                        ) : (
                          friendsNotInGroup.map(f => (
                            <div key={f.id_user} onClick={() => handleAddMember(f.id_user)} style={{ padding: '8px 12px', fontSize: '12px', color: c.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: getAvatarColor(f.id_user), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '9px', fontWeight: 600, flexShrink: 0 }}>
                                {getInitials(f.nama_lengkap)}
                              </div>
                              {f.nama_lengkap}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Keluar grup — bukan owner */}
                {activeGroup.owner_id !== currentUserId && (
                  <button
                    onClick={handleLeaveGroup}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: 'none', color: '#EF4444', fontSize: '11px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
                  >
                    <LogOut size={12} /> Keluar Grup
                  </button>
                )}

                <button
                  onClick={() => { setShowGroupChat(false); setActiveGroup(null); setMessages([]); setShowAddMember(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '8px', background: isDark ? '#27272A' : '#F8FAFC', border: 'none', color: c.muted, fontSize: '11px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
                >
                  <X size={12} /> Tutup
                </button>
              </div>
            </div>

            {/* Area chat */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Header chat */}
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${c.divider}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageCircle size={16} color="#0EA5E9" />
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '14px', color: c.text }}>
                  {activeGroup.nama_group}
                </span>
                <span style={{ fontSize: '11px', color: '#10B981', background: 'rgba(16,185,129,0.1)', borderRadius: '4px', padding: '2px 8px', marginLeft: 'auto' }}>
                  ● Live
                </span>
              </div>

              {/* Daftar pesan */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: c.muted, fontSize: '13px', margin: 'auto' }}>
                    Belum ada pesan. Mulai percakapan!
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.sender_id === currentUserId;
                    return (
                      <div key={msg.id_message} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: '8px', alignItems: 'flex-end' }}>
                        {/* Avatar sender */}
                        {!isMe && (
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: getAvatarColor(msg.sender_id), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 600, flexShrink: 0 }}>
                            {getInitials(msg.sender_name)}
                          </div>
                        )}
                        <div style={{ maxWidth: '65%' }}>
                          {/* Nama sender (bukan milik sendiri) */}
                          {!isMe && (
                            <div style={{ fontSize: '10px', color: c.muted, marginBottom: '3px', paddingLeft: '4px' }}>{msg.sender_name}</div>
                          )}
                          {/* Bubble pesan */}
                          <div style={{
                            background: isMe ? '#0EA5E9' : (isDark ? '#27272A' : '#F1F5F9'),
                            color: isMe ? '#fff' : c.text,
                            padding: '8px 12px',
                            borderRadius: isMe ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                            fontSize: '13px',
                            lineHeight: '1.5',
                          }}>
                            {msg.message}
                            {msg.file_url && (
                              <a href={msg.file_url} target="_blank" rel="noreferrer" style={{ display: 'block', marginTop: '4px', color: isMe ? '#fff' : '#0EA5E9', fontSize: '12px' }}>
                                📎 Lihat file
                              </a>
                            )}
                          </div>
                          {/* Timestamp */}
                          <div style={{ fontSize: '10px', color: c.muted, marginTop: '3px', textAlign: isMe ? 'right' : 'left', paddingLeft: '4px', paddingRight: '4px' }}>
                            {formatTime(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input kirim pesan */}
              <div style={{ padding: '12px 16px', borderTop: `1px solid ${c.divider}`, display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  placeholder="Ketik pesan..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  style={{ flex: 1, height: '40px', borderRadius: '10px', border: `1px solid ${c.inputBorder}`, background: c.inputBg, color: c.text, padding: '0 14px', fontFamily: 'Outfit, sans-serif', fontSize: '13px', outline: 'none' }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  style={{ width: '40px', height: '40px', borderRadius: '10px', background: newMessage.trim() ? '#0EA5E9' : (isDark ? '#27272A' : '#E2E8F0'), border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newMessage.trim() ? 'pointer' : 'default', color: newMessage.trim() ? '#fff' : c.muted, flexShrink: 0 }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================== HEADER HALAMAN ======================== */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', color: c.text, margin: '0 0 4px 0' }}>Teman Belajar</h1>
          <p style={{ color: c.muted, fontSize: '13px', margin: 0 }}>{friends.length} teman · {requests.length > 0 && <span style={{ color: '#F59E0B' }}>{requests.length} permintaan masuk</span>}</p>
        </div>
        <button
          onClick={() => setShowSearchPopup(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '13px', color: '#fff', background: '#0EA5E9', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer' }}
        >
          <UserPlus size={15} /> Tambah Teman
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>

        {/* ======================== KOLOM KIRI: TEMAN ======================== */}
        <div>
          {/* Notifikasi request masuk */}
          {requests.length > 0 && (
            <div style={{ background: isDark ? '#1C1917' : '#FFFBEB', border: '1px solid #F59E0B', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '13px', color: '#F59E0B', marginBottom: '10px' }}>
                🔔 Permintaan Pertemanan ({requests.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {requests.map(req => (
                  <div key={req.id_pertemanan} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: getAvatarColor(req.id_user), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 600, flexShrink: 0 }}>
                      {getInitials(req.nama_lengkap)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: c.text }}>{req.nama_lengkap}</div>
                      <div style={{ fontSize: '11px', color: c.muted }}>{req.email}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleRespondRequest(req.id_pertemanan, 'accept')} style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#10B981', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                        <Check size={14} />
                      </button>
                      <button onClick={() => handleRespondRequest(req.id_pertemanan, 'reject')} style={{ width: '30px', height: '30px', borderRadius: '8px', background: isDark ? '#27272A' : '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#EF4444' }}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Daftar teman */}
          {friends.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: c.muted }}>
              <Users size={40} color={isDark ? '#3F3F46' : '#CBD5E1'} style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '14px' }}>Belum ada teman. Tambah teman pertamamu!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {friends.map(friend => (
                <div key={friend.id_user} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: c.card, border: `0.5px solid ${c.cardBorder}`, borderRadius: '10px', padding: '12px 16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: getAvatarColor(friend.id_user), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '14px', flexShrink: 0 }}>
                    {getInitials(friend.nama_lengkap)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: '14px', color: c.text }}>{friend.nama_lengkap}</div>
                    <div style={{ fontSize: '12px', color: c.muted, marginTop: '2px' }}>{friend.email}</div>
                  </div>
                  <button onClick={() => handleRemoveFriend(friend.id_user, friend.nama_lengkap)} title="Hapus teman" style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.muted, padding: '4px', display: 'flex', alignItems: 'center' }}>
                    <UserMinus size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ======================== KOLOM KANAN: GRUP STUDI ======================== */}
        <div style={{ background: c.card, border: `0.5px solid ${c.cardBorder}`, borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="#0EA5E9" />
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '14px', color: c.text, margin: 0 }}>Grup Studi</h3>
            </div>
            <span style={{ fontSize: '12px', color: c.muted }}>{groups.length} grup</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {groups.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: c.muted, fontSize: '13px' }}>Belum ada grup studi</div>
            ) : (
              groups.map(group => (
                <div key={group.id_group} style={{ background: isDark ? '#27272A' : '#F8FAFC', borderRadius: '8px', padding: '12px', border: `0.5px solid ${c.cardBorder}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: '13px', color: c.text }}>{group.nama_group}</div>
                      <div style={{ fontSize: '11px', color: c.muted, marginTop: '2px' }}>
                        {group.total_anggota} anggota · oleh {group.nama_owner}
                      </div>
                    </div>
                    {group.owner_id === currentUserId && (
                      <button onClick={() => handleDeleteGroup(group.id_group)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '0 0 0 6px', display: 'flex', flexShrink: 0 }}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleOpenGroup(group)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%', padding: '6px 10px', marginTop: '6px', borderRadius: '6px', background: 'rgba(14,165,233,0.1)', border: 'none', color: '#0EA5E9', fontSize: '12px', fontFamily: 'Outfit, sans-serif', fontWeight: 500, cursor: 'pointer', justifyContent: 'center' }}
                  >
                    <MessageCircle size={13} /> Buka Chat
                  </button>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setShowCreateGroup(true)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'Outfit, sans-serif', fontWeight: 400, fontSize: '12px', color: c.muted, background: 'none', border: `1px dashed ${isDark ? '#3F3F46' : '#CBD5E1'}`, borderRadius: '6px', padding: '9px', cursor: 'pointer', marginTop: '10px' }}
          >
            <Plus size={13} /> Buat Grup Baru
          </button>
        </div>
      </div>
    </div>
  );
}