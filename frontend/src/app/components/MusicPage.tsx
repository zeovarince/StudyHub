import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Search, Play, Pause, SkipBack, SkipForward,
  Music2, Loader2, Plus, Trash2, ListMusic, X,
  ChevronRight, Shuffle
} from 'lucide-react';
import { colors } from '../types';
import ReactPlayer from "react-player";

// ============================================================
// INTERFACES
// ============================================================
interface Song {
  id: string;
  title: string;
  channel: string;
  duration: string;
  color: string;
  url: string;
}

interface Playlist {
  id_playlist: number;
  nama_playlist: string;
  deskripsi: string | null;
  is_public: boolean;
  total_lagu: number;
  pembuat?: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface MusicPageProps {
  isDark: boolean;
}

// ============================================================
// CONSTANTS
// ============================================================
const BG_COLORS = ['#6366F1', '#F97316', '#10B981', '#0EA5E9', '#8B5CF6', '#EC4899', '#F59E0B'];

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
};

// ============================================================
// KOMPONEN UTAMA
// ============================================================
export function MusicPage({ isDark }: MusicPageProps) {
  const c = colors(isDark);

  // --- State: pencarian & daftar lagu YouTube ---
  const [search, setSearch] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- State: player ---
  const [currentId, setCurrentId] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<any>(null);

  // --- State: playlist ---
  const [myPlaylists, setMyPlaylists] = useState<Playlist[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [playlistView, setPlaylistView] = useState<'mine' | 'search'>('mine');
  const [playlistSearch, setPlaylistSearch] = useState('');
  const [searchedPlaylists, setSearchedPlaylists] = useState<Playlist[]>([]);

  // --- State: antrian (queue) ---
  const [queue, setQueue] = useState<Song[]>([]);

  // --- State: mode play playlist ---
  // 'none' = tidak sedang play playlist, 'order' = urutan, 'shuffle' = acak
  const [playlistMode, setPlaylistMode] = useState<'none' | 'order' | 'shuffle'>('none');
  const [playlistQueue, setPlaylistQueue] = useState<Song[]>([]); // sisa lagu playlist yang belum diplay
  const playlistModeRef = useRef(playlistMode);
  const playlistQueueRef = useRef(playlistQueue);

  useEffect(() => { playlistModeRef.current = playlistMode; }, [playlistMode]);
  useEffect(() => { playlistQueueRef.current = playlistQueue; }, [playlistQueue]);

  // --- State: toast notifikasi ---
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  // ============================================================
  // FUNGSI: TOAST NOTIFIKASI
  // ============================================================
  const showToast = (message: string, type: 'success' | 'error') => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    // Auto-hilang setelah 3 detik
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // ============================================================
  // FETCH AWAL
  // ============================================================
  useEffect(() => {
    fetchMusic();
    fetchMyPlaylists();
  }, []);

  // ============================================================
  // FUNGSI: MUSIK YOUTUBE
  // ============================================================
  const fetchMusic = async (query: string = 'lofi study music') => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/music/search?q=${query}`);
      const fetchedSongs = response.data.data.map((vid: any, index: number) => ({
        id: vid.id,
        title: vid.title,
        channel: vid.author,
        duration: vid.duration,
        color: BG_COLORS[index % BG_COLORS.length],
        url: vid.url,
      }));
      setSongs(fetchedSongs);
      if (fetchedSongs.length > 0) setCurrentId(fetchedSongs[0].id);
    } catch (error) {
      console.error('Gagal memuat musik:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) fetchMusic(search);
  };

  // ============================================================
  // FUNGSI: PLAYER & SEEK BAR
  // ============================================================
  const currentSong = songs.find(s => s.id === currentId) ?? songs[0];
  const currentIdx = songs.findIndex(s => s.id === currentId);

  const handleSelectSong = (id: string) => {
    setIsPlaying(false);
    setPlayed(0);
    setDuration(0);
    setCurrentId(id);
  };

  const handlePrev = () => {
    // Kalau lagi mode playlist, mundur di daftar playlistSongs
    if (playlistModeRef.current !== 'none') {
      const idx = playlistSongs.findIndex(s => s.id === currentId);
      if (idx > 0) {
        const prev = playlistSongs[idx - 1];
        setSongs(prev2 => prev2.find(s => s.id === prev.id) ? prev2 : [...prev2, prev]);
        handleSelectSong(prev.id);
      }
      return;
    }
    if (songs.length === 0) return;
    const prevIdx = (currentIdx - 1 + songs.length) % songs.length;
    handleSelectSong(songs[prevIdx].id);
  };

  // handleNext: urutan prioritas:
  // 1. Kalau mode playlist aktif → ambil dari playlistQueue
  // 2. Kalau ada lagu di queue manual → ambil dari sana
  // 3. Default → lagu berikutnya di daftar pencarian
  const handleNext = () => {
    if (playlistModeRef.current !== 'none' && playlistQueueRef.current.length > 0) {
      const next = playlistQueueRef.current[0];
      setPlaylistQueue(prev => prev.slice(1));
      setSongs(prev => prev.find(s => s.id === next.id) ? prev : [...prev, next]);
      handleSelectSong(next.id);
      return;
    }
    if (playlistModeRef.current !== 'none' && playlistQueueRef.current.length === 0) {
      // Playlist habis
      setPlaylistMode('none');
    }
    if (queue.length > 0) {
      const next = queue[0];
      setQueue(prev => prev.slice(1));
      setSongs(prev => prev.find(s => s.id === next.id) ? prev : [...prev, next]);
      handleSelectSong(next.id);
      return;
    }
    if (songs.length === 0) return;
    const nextIdx = (currentIdx + 1) % songs.length;
    handleSelectSong(songs[nextIdx].id);
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    playerRef.current.currentTime = percentage * duration;
    setPlayed(percentage * duration);
  };

  // ============================================================
  // FUNGSI: PLAY PLAYLIST (URUTAN / ACAK)
  // ============================================================
  const handlePlayPlaylist = (mode: 'order' | 'shuffle') => {
    if (playlistSongs.length === 0) return;

    let ordered = [...playlistSongs];
    if (mode === 'shuffle') {
      // Fisher-Yates shuffle — algoritma acak yang merata
      for (let i = ordered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
      }
    }

    const first = ordered[0];
    const rest = ordered.slice(1);

    setPlaylistMode(mode);
    setPlaylistQueue(rest);
    // Pastikan semua lagu playlist masuk ke state songs supaya bisa di-find player
    setSongs(prev => {
      const ids = new Set(prev.map(s => s.id));
      const newSongs = ordered.filter(s => !ids.has(s.id));
      return [...prev, ...newSongs];
    });
    handleSelectSong(first.id);
  };

  // ============================================================
  // FUNGSI: ANTRIAN (QUEUE) MANUAL
  // ============================================================
  const addToQueue = (song: Song) => {
    if (queue.find(s => s.id === song.id)) {
      showToast('Lagu sudah ada di antrian', 'error');
      return;
    }
    setQueue(prev => [...prev, song]);
    showToast(`Ditambahkan ke antrian: ${song.title}`, 'success');
  };

  const removeFromQueue = (songId: string) => {
    setQueue(prev => prev.filter(s => s.id !== songId));
  };

  // ============================================================
  // FUNGSI: PLAYLIST CRUD
  // ============================================================
  const fetchMyPlaylists = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/playlists', getAuthHeader());
      setMyPlaylists(response.data.data);
    } catch (error) {
      console.error('Gagal memuat playlist:', error);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      await axios.post(
        'http://localhost:5000/api/playlists',
        { nama_playlist: newPlaylistName, deskripsi: newPlaylistDesc, is_public: true },
        getAuthHeader()
      );
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setShowCreateModal(false);
      fetchMyPlaylists();
      showToast('Playlist berhasil dibuat!', 'success');
    } catch (error) {
      showToast('Gagal membuat playlist', 'error');
    }
  };

  // Buka playlist (bisa milik sendiri atau orang lain dari hasil search)
  const handleOpenPlaylist = async (playlist: Playlist) => {
    setActivePlaylist(playlist);
    setPlaylistMode('none');
    setPlaylistQueue([]);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/playlists/${playlist.id_playlist}/songs`,
        getAuthHeader()
      );
      const formatted = response.data.data.map((s: any, index: number) => ({
        id: s.youtube_id,
        title: s.judul,
        channel: s.channel || '-',
        duration: s.durasi || '-',
        color: BG_COLORS[index % BG_COLORS.length],
        url: `https://youtube.com/watch?v=${s.youtube_id}`,
      }));
      setPlaylistSongs(formatted);
    } catch (error) {
      showToast('Gagal memuat isi playlist', 'error');
    }
  };

  const handleDeletePlaylist = async (playlistId: number) => {
    if (!window.confirm('Hapus playlist ini?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/playlists/${playlistId}`, getAuthHeader());
      if (activePlaylist?.id_playlist === playlistId) {
        setActivePlaylist(null);
        setPlaylistSongs([]);
      }
      fetchMyPlaylists();
      showToast('Playlist berhasil dihapus', 'error'); // merah karena aksi hapus
    } catch (error) {
      showToast('Gagal menghapus playlist', 'error');
    }
  };

  const handleAddSongToPlaylist = async (playlistId: number, song: Song) => {
    try {
      await axios.post(
        `http://localhost:5000/api/playlists/${playlistId}/songs`,
        { youtube_id: song.id, judul: song.title, channel: song.channel, durasi: song.duration, thumbnail: '' },
        getAuthHeader()
      );
      if (activePlaylist?.id_playlist === playlistId) handleOpenPlaylist(activePlaylist);
      fetchMyPlaylists();
      showToast(`Lagu ditambahkan ke playlist!`, 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Gagal menambahkan lagu', 'error');
    }
  };

  const handleRemoveSongFromPlaylist = async (songId: string) => {
    if (!activePlaylist) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/playlists/${activePlaylist.id_playlist}/songs`,
        getAuthHeader()
      );
      const found = response.data.data.find((s: any) => s.youtube_id === songId);
      if (!found) return;
      await axios.delete(
        `http://localhost:5000/api/playlists/${activePlaylist.id_playlist}/songs/${found.id_song}`,
        getAuthHeader()
      );
      handleOpenPlaylist(activePlaylist);
      fetchMyPlaylists();
      showToast('Lagu dihapus dari playlist', 'error'); // merah karena aksi hapus
    } catch (error) {
      showToast('Gagal menghapus lagu', 'error');
    }
  };

  const handleSearchPlaylists = async () => {
    if (!playlistSearch.trim()) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/playlists/search?q=${playlistSearch}`,
        getAuthHeader()
      );
      setSearchedPlaylists(response.data.data);
    } catch (error) {
      showToast('Gagal mencari playlist', 'error');
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', fontFamily: 'Outfit, sans-serif', position: 'relative' }}>

      {/* ======================== TOAST NOTIFIKASI ======================== */}
      {/* Muncul di pojok kanan bawah layar, stack ke atas kalau lebih dari 1 */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              background: toast.type === 'success' ? '#16A34A' : '#DC2626',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              maxWidth: '280px',
              animation: 'slideIn 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>{toast.type === 'success' ? '✓' : '✕'}</span>
            {toast.message}
          </div>
        ))}
      </div>

      {/* ======================== PEMUTAR AUDIO TERSEMBUNYI ======================== */}
      <div style={{ position: 'absolute', width: '300px', height: '170px', top: '-9999px', left: '-9999px', opacity: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -10 }}>
        <ReactPlayer
          ref={playerRef}
          src={currentSong?.url || ''}
          playing={isPlaying}
          controls={false}
          muted={false}
          volume={1}
          width="300px"
          height="170px"
          onEnded={handleNext}
          onReady={() => setIsPlaying(true)}
          onError={(e) => console.error('❌ Player error:', e)}
          onTimeUpdate={() => { if (playerRef.current) setPlayed(playerRef.current.currentTime || 0); }}
          onDurationChange={() => { if (playerRef.current) setDuration(playerRef.current.duration || 0); }}
          config={{ youtube: { playerVars: { origin: window.location.origin, disablekb: 1, playsinline: 1, autoplay: 1, mute: 0 } } }}
        />
      </div>

      {/* ======================== MODAL BUAT PLAYLIST BARU ======================== */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: c.card, borderRadius: '12px', padding: '24px', width: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '15px', color: c.text }}>Buat Playlist Baru</span>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.muted }}><X size={18} /></button>
            </div>
            <input
              placeholder="Nama playlist..."
              value={newPlaylistName}
              onChange={e => setNewPlaylistName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreatePlaylist()}
              style={{ width: '100%', height: '38px', borderRadius: '8px', border: `1px solid ${c.inputBorder}`, background: c.inputBg, color: c.text, padding: '0 12px', fontFamily: 'Outfit, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box', marginBottom: '10px' }}
            />
            <input
              placeholder="Deskripsi (opsional)..."
              value={newPlaylistDesc}
              onChange={e => setNewPlaylistDesc(e.target.value)}
              style={{ width: '100%', height: '38px', borderRadius: '8px', border: `1px solid ${c.inputBorder}`, background: c.inputBg, color: c.text, padding: '0 12px', fontFamily: 'Outfit, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
            />
            <button
              onClick={handleCreatePlaylist}
              style={{ width: '100%', height: '38px', borderRadius: '8px', background: '#0EA5E9', border: 'none', color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
            >
              Buat Playlist
            </button>
          </div>
        </div>
      )}

      {/* ======================== HEADING ======================== */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', color: c.text, margin: '0 0 4px 0' }}>Musik Belajar</h1>
        <p style={{ color: c.muted, fontSize: '13px', margin: 0 }}>Putar musik favoritmu untuk fokus belajar lebih baik</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', alignItems: 'start' }}>

        {/* ======================== KOLOM KIRI: PLAYER + DAFTAR LAGU + ANTRIAN ======================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: c.card, border: `0.5px solid ${c.cardBorder}`, borderRadius: '12px', overflow: 'hidden' }}>

            {/* Search lagu */}
            <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${c.divider}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '14px', color: c.text }}>Study Music</span>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '10px', color: '#0EA5E9', background: 'rgba(14,165,233,0.1)', borderRadius: '4px', padding: '2px 7px' }}>via YouTube</span>
              </div>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#64748B" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Ketik lalu tekan Enter..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                  style={{ width: '100%', height: '36px', fontFamily: 'Outfit, sans-serif', fontSize: '13px', color: c.text, background: c.inputBg, border: `1px solid ${c.inputBorder}`, borderRadius: '8px', padding: '0 12px 0 34px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Daftar lagu */}
            <div style={{ maxHeight: '280px', minHeight: '200px', overflowY: 'auto' }}>
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: c.muted, gap: '8px' }}>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '13px' }}>Mencari musik...</span>
                </div>
              ) : songs.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: c.muted, fontSize: '13px' }}>Tidak ada hasil</div>
              ) : (
                songs.map(song => {
                  const isActive = song.id === currentId;
                  return (
                    <div key={song.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 10px', background: isActive ? 'rgba(14,165,233,0.05)' : 'transparent', borderLeft: isActive ? '2px solid #0EA5E9' : '2px solid transparent' }}>
                      <div onClick={() => handleSelectSong(song.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0, cursor: 'pointer' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '6px', background: song.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Music2 size={15} color="rgba(255,255,255,0.8)" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '12px', color: isActive ? '#0EA5E9' : c.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                          <div style={{ fontSize: '11px', color: c.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.channel}</div>
                        </div>
                      </div>
                      {/* Tombol tambah ke antrian */}
                      <button onClick={() => addToQueue(song)} title="Tambah ke antrian" style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.muted, padding: '2px', flexShrink: 0, display: 'flex' }}>
                        <ListMusic size={14} />
                      </button>
                      {/* Dropdown tambah ke playlist */}
                      <select
                        onChange={e => { if (e.target.value) { handleAddSongToPlaylist(Number(e.target.value), song); e.target.value = ''; } }}
                        defaultValue=""
                        title="Tambah ke playlist"
                        style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}`, borderRadius: '4px', color: c.muted, fontSize: '10px', padding: '2px 4px', cursor: 'pointer', maxWidth: '72px' }}
                      >
                        <option value="" disabled>+ List</option>
                        {myPlaylists.map(pl => (
                          <option key={pl.id_playlist} value={pl.id_playlist}>{pl.nama_playlist}</option>
                        ))}
                      </select>
                    </div>
                  );
                })
              )}
            </div>

            {/* Mini player bar */}
            {currentSong && (
              <div style={{ background: isDark ? '#27272A' : '#F8FAFC', borderTop: `1px solid ${c.divider}`, padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: currentSong.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Music2 size={13} color="rgba(255,255,255,0.8)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '11px', color: c.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.title}</div>
                    <div style={{ fontSize: '10px', color: c.muted }}>{currentSong.channel}</div>
                  </div>
                  {/* Badge mode playlist */}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '10px', color: c.muted }}>{formatTime(played)}</span>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '10px', color: c.muted }}>{formatTime(duration)}</span>
                </div>
                <div onClick={handleSeek} style={{ height: '6px', background: isDark ? '#3F3F46' : '#E2E8F0', borderRadius: '3px', marginBottom: '10px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
                  <div style={{ height: '100%', width: duration > 0 ? `${(played / duration) * 100}%` : '0%', background: '#0EA5E9', borderRadius: '3px', transition: 'width 0.2s linear', pointerEvents: 'none' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                  <button onClick={handlePrev} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.muted, padding: '2px', display: 'flex' }}><SkipBack size={17} /></button>
                  <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#0EA5E9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: 0 }}>
                    {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                  </button>
                  <button onClick={handleNext} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.muted, padding: '2px', display: 'flex' }}><SkipForward size={17} /></button>
                </div>
              </div>
            )}
          </div>

          {/* ANTRIAN (QUEUE) MANUAL */}
          {queue.length > 0 && (
            <div style={{ background: c.card, border: `0.5px solid ${c.cardBorder}`, borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: `1px solid ${c.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '13px', color: c.text }}>Antrian ({queue.length})</span>
                <button onClick={() => setQueue([])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.muted, fontSize: '11px', fontFamily: 'Outfit, sans-serif' }}>Hapus semua</button>
              </div>
              {queue.map((song, idx) => (
                <div key={song.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 12px', borderBottom: idx < queue.length - 1 ? `1px solid ${c.divider}` : 'none' }}>
                  <span style={{ fontSize: '10px', color: c.muted, width: '14px', flexShrink: 0 }}>{idx + 1}</span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '5px', background: song.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Music2 size={12} color="rgba(255,255,255,0.8)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', color: c.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                  </div>
                  <button onClick={() => removeFromQueue(song.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.muted, padding: '2px', display: 'flex' }}>
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ======================== KOLOM KANAN: PLAYLIST ======================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: c.card, border: `0.5px solid ${c.cardBorder}`, borderRadius: '12px', padding: '20px' }}>

            {/* Tab header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setPlaylistView('mine')} style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', color: playlistView === 'mine' ? '#0EA5E9' : c.muted, borderBottom: playlistView === 'mine' ? '2px solid #0EA5E9' : '2px solid transparent', paddingBottom: '4px' }}>
                  Playlist Saya
                </button>
                <button onClick={() => setPlaylistView('search')} style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', color: playlistView === 'search' ? '#0EA5E9' : c.muted, borderBottom: playlistView === 'search' ? '2px solid #0EA5E9' : '2px solid transparent', paddingBottom: '4px' }}>
                  Jelajahi
                </button>
              </div>
              {playlistView === 'mine' && (
                <button onClick={() => setShowCreateModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0EA5E9', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', fontFamily: 'Outfit, sans-serif', fontWeight: 500, padding: '5px 10px', cursor: 'pointer' }}>
                  <Plus size={13} /> Buat
                </button>
              )}
            </div>

            {/* VIEW: PLAYLIST SAYA */}
            {playlistView === 'mine' && (
              <>
                {myPlaylists.length === 0 ? (
                  <div style={{ textAlign: 'center', color: c.muted, fontSize: '13px', padding: '32px 0' }}>Belum ada playlist. Buat yang pertama!</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: activePlaylist ? '16px' : 0 }}>
                    {myPlaylists.map(pl => (
                      <div key={pl.id_playlist} style={{ background: isDark ? '#27272A' : '#F8FAFC', borderRadius: '8px', padding: '12px', border: `0.5px solid ${activePlaylist?.id_playlist === pl.id_playlist ? '#0EA5E9' : c.cardBorder}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 500, fontSize: '13px', color: c.text, flex: 1, wordBreak: 'break-word' }}>{pl.nama_playlist}</span>
                          <button onClick={() => handleDeletePlaylist(pl.id_playlist)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '0 0 0 4px', flexShrink: 0, display: 'flex' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div style={{ fontSize: '11px', color: c.muted, marginBottom: '8px' }}>{pl.total_lagu} lagu</div>
                        <button onClick={() => handleOpenPlaylist(pl)} style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', color: '#0EA5E9', fontSize: '11px', fontFamily: 'Outfit, sans-serif', padding: 0 }}>
                          Lihat isi <ChevronRight size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* ISI PLAYLIST YANG DIBUKA */}
                {activePlaylist && (
                  <div style={{ marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '13px', color: c.text }}>{activePlaylist.nama_playlist}</span>
                      <button onClick={() => { setActivePlaylist(null); setPlaylistSongs([]); setPlaylistMode('none'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.muted, display: 'flex' }}>
                        <X size={15} />
                      </button>
                    </div>

                    {/* Tombol play urutan & acak — hanya muncul kalau ada lagu */}
                    {playlistSongs.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <button
                          onClick={() => handlePlayPlaylist('order')}
                          style={{ flex: 1, height: '32px', borderRadius: '6px', background: playlistMode === 'order' ? '#0EA5E9' : 'rgba(14,165,233,0.1)', border: 'none', color: playlistMode === 'order' ? '#fff' : '#0EA5E9', fontSize: '12px', fontFamily: 'Outfit, sans-serif', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        >
                          <Play size={12} /> Play Urutan
                        </button>
                        <button
                          onClick={() => handlePlayPlaylist('shuffle')}
                          style={{ flex: 1, height: '32px', borderRadius: '6px', background: playlistMode === 'shuffle' ? '#0EA5E9' : 'rgba(14,165,233,0.1)', border: 'none', color: playlistMode === 'shuffle' ? '#fff' : '#0EA5E9', fontSize: '12px', fontFamily: 'Outfit, sans-serif', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        >
                          <Shuffle size={12} /> Acak
                        </button>
                      </div>
                    )}

                    {playlistSongs.length === 0 ? (
                      <div style={{ color: c.muted, fontSize: '12px', textAlign: 'center', padding: '16px 0' }}>Playlist masih kosong</div>
                    ) : (
                      playlistSongs.map((song, idx) => {
                        const isCurrentInPlaylist = song.id === currentId;
                        return (
                          <div key={song.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 0', borderBottom: idx < playlistSongs.length - 1 ? `1px solid ${c.divider}` : 'none', background: isCurrentInPlaylist ? 'rgba(14,165,233,0.04)' : 'transparent', borderRadius: '4px' }}>
                            <span style={{ fontSize: '10px', color: c.muted, width: '16px', flexShrink: 0, textAlign: 'center' }}>
                              {isCurrentInPlaylist && isPlaying ? '▶' : idx + 1}
                            </span>
                            <div style={{ width: '30px', height: '30px', borderRadius: '5px', background: song.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Music2 size={13} color="rgba(255,255,255,0.8)" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => {
                              setSongs(prev => prev.find(s => s.id === song.id) ? prev : [...prev, song]);
                              handleSelectSong(song.id);
                              setPlaylistMode('none');
                            }}>
                              <div style={{ fontSize: '12px', color: isCurrentInPlaylist ? '#0EA5E9' : c.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                              <div style={{ fontSize: '10px', color: c.muted }}>{song.channel} · {song.duration}</div>
                            </div>
                            <button onClick={() => handleRemoveSongFromPlaylist(song.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', display: 'flex', padding: '2px', flexShrink: 0 }}>
                              <X size={13} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </>
            )}

            {/* VIEW: JELAJAHI PLAYLIST PUBLIK */}
            {playlistView === 'search' && (
              <>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={14} color="#64748B" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      placeholder="Cari nama playlist atau pembuat..."
                      value={playlistSearch}
                      onChange={e => setPlaylistSearch(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearchPlaylists()}
                      style={{ width: '100%', height: '34px', borderRadius: '8px', border: `1px solid ${c.inputBorder}`, background: c.inputBg, color: c.text, padding: '0 12px 0 32px', fontFamily: 'Outfit, sans-serif', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button onClick={handleSearchPlaylists} style={{ height: '34px', padding: '0 12px', borderRadius: '8px', background: '#0EA5E9', border: 'none', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>Cari</button>
                </div>
                {searchedPlaylists.length === 0 ? (
                  <div style={{ color: c.muted, fontSize: '12px', textAlign: 'center', padding: '24px 0' }}>Ketik keyword lalu tekan Enter atau klik Cari</div>
                ) : (
                  searchedPlaylists.map(pl => (
                    <div key={pl.id_playlist} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: `1px solid ${c.divider}` }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: c.text }}>{pl.nama_playlist}</div>
                        <div style={{ fontSize: '11px', color: c.muted }}>oleh {pl.pembuat} · {pl.total_lagu} lagu</div>
                      </div>
                      {/* Tombol Buka: membuka isi playlist orang lain, lagu bisa langsung diplay */}
                      <button
                        onClick={() => {
                          handleOpenPlaylist(pl);
                          setPlaylistView('mine'); // pindah ke tab mine supaya tampilan isi playlist kelihatan
                          showToast(`Playlist "${pl.nama_playlist}" dibuka`, 'success');
                        }}
                        style={{ background: 'rgba(14,165,233,0.1)', border: 'none', borderRadius: '6px', color: '#0EA5E9', fontSize: '11px', padding: '4px 10px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', flexShrink: 0 }}
                      >
                        Buka
                      </button>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}