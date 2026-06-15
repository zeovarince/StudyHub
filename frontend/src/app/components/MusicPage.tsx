import { useState } from 'react';
import { Search, Play, Pause, SkipBack, SkipForward, Music2 } from 'lucide-react';
import { colors } from '../types';
import ReactPlayer from 'react-player/youtube'; 

interface Song {
  id: string;
  title: string;
  channel: string;
  duration: string;
  color: string;
  url: string; 
}

const SONGS: Song[] = [
  { 
    id: '1', 
    title: 'Lofi Hip Hop - Chill Study Beats', 
    channel: 'Lofi Girl', 
    duration: 'LIVE', 
    color: '#6366F1',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' // Link asli Lofi Girl
  },
  { 
    id: '2', 
    title: 'Jazz Cafe Morning Mix', 
    channel: 'Cafe Jazz', 
    duration: '4:12', 
    color: '#F97316',
    url: 'https://www.youtube.com/watch?v=neV3EPgvZ3g'
  },
  { 
    id: '3', 
    title: 'Classical Piano for Focus', 
    channel: 'Relaxing Piano', 
    duration: '5:30', 
    color: '#10B981',
    url: 'https://www.youtube.com/watch?v=mIYzpCGsywk'
  },
  { 
    id: '4', 
    title: 'Rainy Day Ambient Sounds', 
    channel: 'Nature Sounds', 
    duration: '6:15', 
    color: '#0EA5E9',
    url: 'https://www.youtube.com/watch?v=mPZkdNFkNps'
  },
];

const PLAYLISTS = [
  { id: '1', name: 'Favorit', songs: 12 },
  { id: '2', name: 'Lofi Vibes', songs: 8 },
  { id: '3', name: 'Focus Mode', songs: 15 },
  { id: '4', name: 'Late Night', songs: 6 },
];

interface MusicPageProps {
  isDark: boolean;
}

export function MusicPage({ isDark }: MusicPageProps) {
  const c = colors(isDark);
  const [search, setSearch] = useState('');
  const [currentId, setCurrentId] = useState<string>('1');
  const [isPlaying, setIsPlaying] = useState(false);

  const filtered = SONGS.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.channel.toLowerCase().includes(search.toLowerCase())
  );

  const currentSong = SONGS.find(s => s.id === currentId) ?? SONGS[0];
  const currentIdx = SONGS.findIndex(s => s.id === currentId);

  const handlePrev = () => {
    const prevIdx = (currentIdx - 1 + SONGS.length) % SONGS.length;
    setCurrentId(SONGS[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIdx + 1) % SONGS.length;
    setCurrentId(SONGS[nextIdx].id);
  };

  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '32px 24px',
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: '20px',
            color: c.text,
            margin: '0 0 4px 0',
          }}
        >
          Musik Belajar
        </h1>
        <p style={{ color: c.muted, fontSize: '13px', margin: 0 }}>
          Putar musik favoritmu untuk fokus belajar lebih baik
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Music Player Panel */}
        <div
          style={{
            background: c.card,
            border: `0.5px solid ${c.cardBorder}`,
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Panel Header */}
          <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${c.divider}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: c.text,
                }}
              >
                Study Music
              </span>
              <span
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontSize: '10px',
                  color: '#0EA5E9',
                  background: 'rgba(14,165,233,0.1)',
                  borderRadius: '4px',
                  padding: '2px 7px',
                }}
              >
                via YouTube
              </span>
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                color="#64748B"
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Cari musik lofi, jazz, classical..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 400,
                  fontSize: '13px',
                  color: c.text,
                  background: c.inputBg,
                  border: `1px solid ${c.inputBorder}`,
                  borderRadius: '8px',
                  padding: '0 12px 0 34px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Pemutar Audio Tersembunyi */}
          <div style={{ display: 'none' }}>
            <ReactPlayer
              url={currentSong?.url}
              playing={isPlaying}
              controls={false}
              volume={0.5}
              onEnded={handleNext}
            />
          </div>

          {/* Song List */}
          <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
            {filtered.map(song => {
              const isActive = song.id === currentId;
              return (
                <div
                  key={song.id}
                  onClick={() => { setCurrentId(song.id); setIsPlaying(true); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    background: isActive ? 'rgba(14,165,233,0.05)' : 'transparent',
                    borderLeft: isActive ? '2px solid #0EA5E9' : '2px solid transparent',
                    transition: 'background 0.1s',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '6px',
                      background: song.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Music2 size={16} color="rgba(255,255,255,0.8)" />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 500,
                        fontSize: '13px',
                        color: isActive ? '#0EA5E9' : c.text,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {song.title}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '11px',
                        color: c.muted,
                        marginTop: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {song.channel}
                    </div>
                  </div>

                  {/* Duration */}
                  <span
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 400,
                      fontSize: '11px',
                      color: c.muted,
                      flexShrink: 0,
                    }}
                  >
                    {song.duration}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Player Controls Bar */}
          <div
            style={{
              background: isDark ? '#27272A' : '#F8FAFC',
              borderTop: `1px solid ${c.divider}`,
              padding: '10px 14px',
            }}
          >
            {/* Now Playing */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: currentSong.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Music2 size={14} color="rgba(255,255,255,0.8)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    fontSize: '12px',
                    color: c.text,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {currentSong.title}
                </div>
                <div style={{ fontSize: '11px', color: c.muted }}>{currentSong.channel}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                height: '3px',
                background: isDark ? '#3F3F46' : '#E2E8F0',
                borderRadius: '2px',
                marginBottom: '10px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: isPlaying ? '35%' : '0%',
                  background: '#0EA5E9',
                  borderRadius: '2px',
                  transition: 'width 0.3s',
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <button
                onClick={handlePrev}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.muted, padding: '2px', display: 'flex', alignItems: 'center' }}
              >
                <SkipBack size={18} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#0EA5E9',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  padding: 0,
                }}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={handleNext}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.muted, padding: '2px', display: 'flex', alignItems: 'center' }}
              >
                <SkipForward size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Playlists + Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Playlists */}
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
              Playlist
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {PLAYLISTS.map(pl => (
                <div
                  key={pl.id}
                  style={{
                    background: isDark ? '#27272A' : '#F8FAFC',
                    borderRadius: '8px',
                    padding: '14px',
                    cursor: 'pointer',
                    border: `0.5px solid ${c.cardBorder}`,
                  }}
                >
                  <div style={{ fontWeight: 500, fontSize: '13px', color: c.text, marginBottom: '4px' }}>
                    {pl.name}
                  </div>
                  <div style={{ fontSize: '12px', color: c.muted }}>{pl.songs} lagu</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Card */}
          <div
            style={{
              background: 'rgba(14,165,233,0.06)',
              border: '1px solid rgba(14,165,233,0.15)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h3
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: '#0EA5E9',
                margin: '0 0 12px 0',
              }}
            >
              Tips Belajar
            </h3>
            <ul
              style={{
                margin: 0,
                padding: '0 0 0 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {[
                'Musik lofi tanpa lirik paling cocok untuk fokus mendalam',
                'Atur volume di 40–50% agar tidak mengganggu konsentrasi',
                'Gunakan teknik Pomodoro: 25 menit belajar, 5 menit istirahat',
                'Hindari musik dengan beat terlalu cepat saat membaca teks',
              ].map((tip, i) => (
                <li
                  key={i}
                  style={{ fontSize: '13px', color: isDark ? '#A1A1AA' : '#475569', lineHeight: 1.5 }}
                >
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}