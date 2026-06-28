import { useState, useRef, useEffect } from 'react';
import { LogOut, User, LayoutDashboard, CheckSquare, Users, Music, X, Sun, Moon } from 'lucide-react';
import { type Page, colors } from '../types';
import { StudyHubLogo } from './logo';

interface NavbarProps {
  isDark: boolean;
  onToggleDark: () => void;
  activePage: Page;
  onNavigate: (page: Page) => void;
  userName: string;
  userEmail: string;
  userPhoto?: string;
  onLogout: () => void;
  onEditProfile: () => void;
}

const navLinks: { page: Page; label: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { page: 'Dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { page: 'Tugas',     label: 'Tugas',     Icon: CheckSquare },
  { page: 'Teman',     label: 'Teman',     Icon: Users },
  { page: 'Musik',     label: 'Musik',     Icon: Music },
];

export function Navbar({
  isDark, onToggleDark, activePage, onNavigate,
  userName, userEmail, userPhoto, onLogout, onEditProfile,
}: NavbarProps) {
  const c = colors(isDark);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = userName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const Avatar = ({ size = 32, fontSize = 12 }: { size?: number; fontSize?: number }) => (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: userPhoto ? 'transparent' : '#0EA5E9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: 'Outfit, sans-serif',
      fontWeight: 600, fontSize, flexShrink: 0, overflow: 'hidden',
    }}>
      {userPhoto
        ? <img src={userPhoto} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        : initials}
    </div>
  );

  return (
    <>
      {/* ═══════════════════════════════════════
          TOP NAVBAR — Desktop (≥768px)
      ═══════════════════════════════════════ */}
      <nav className="top-navbar" style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '56px',
        background: c.navBg,
        borderBottom: `1px solid ${c.navBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 1000,
        fontFamily: 'Outfit, sans-serif',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <StudyHubLogo size={28} />
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', lineHeight: 1, userSelect: 'none' }}>
            <span style={{ color: c.text }}>Study</span>
            <span style={{ color: '#0EA5E9' }}>Hub</span>
          </span>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {navLinks.map(({ page, label }) => (
            <button key={page} onClick={() => onNavigate(page)} style={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '14px',
              color: activePage === page ? '#0EA5E9' : c.muted,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 0 8px 0', position: 'relative', transition: 'color 0.15s',
            }}>
              {label}
              {activePage === page && (
                <span style={{
                  position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                  width: '4px', height: '4px', borderRadius: '50%', background: '#0EA5E9', display: 'block',
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Right: Toggle + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onToggleDark} aria-label="Toggle dark mode" style={{
            width: '44px', height: '24px', borderRadius: '12px',
            background: isDark ? '#0EA5E9' : '#64748B',
            border: 'none', cursor: 'pointer', position: 'relative', padding: 0, flexShrink: 0,
          }}>
            <span style={{
              position: 'absolute', top: '3px',
              left: isDark ? '23px' : '3px',
              width: '18px', height: '18px', borderRadius: '50%',
              background: '#fff', display: 'block', transition: 'left 0.15s ease',
            }} />
          </button>

          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button onClick={() => setDropdownOpen(o => !o)} style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'none', border: dropdownOpen ? '2px solid rgba(14,165,233,0.4)' : '2px solid transparent',
              cursor: 'pointer', padding: 0, transition: 'border 0.15s', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Avatar size={32} fontSize={12} />
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                width: '220px', background: c.navBg,
                border: `1px solid ${c.navBorder}`, borderRadius: '10px',
                boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(15,23,42,0.10)',
                overflow: 'hidden', zIndex: 200,
              }}>
                <div style={{ padding: '14px 16px', borderBottom: `1px solid ${c.navBorder}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Avatar size={36} fontSize={13} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: c.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
                    <div style={{ fontSize: '11px', color: c.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</div>
                  </div>
                </div>
                <div style={{ padding: '6px' }}>
                  <button onClick={() => { setDropdownOpen(false); onEditProfile(); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', background: 'none', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontSize: '13px', color: c.muted, textAlign: 'left' }}
                    onMouseEnter={e => (e.currentTarget.style.background = isDark ? '#27272A' : '#F8FAFC')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <User size={15} /> Profil Saya
                  </button>
                  <div style={{ height: '1px', background: c.navBorder, margin: '4px 0' }} />
                  <button onClick={() => { setDropdownOpen(false); onLogout(); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', background: 'none', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontSize: '13px', color: '#EF4444', textAlign: 'left' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <LogOut size={15} /> Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════
          TOP HEADER — Mobile (<768px)
          Logo kiri · Toggle tema kanan
      ═══════════════════════════════════════ */}
      <div className="mobile-top-header" style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '52px',
        background: c.navBg,
        borderBottom: `1px solid ${c.navBorder}`,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',   // ← logo kiri, toggle kanan
        padding: '0 16px',
        zIndex: 999,
        fontFamily: 'Outfit, sans-serif',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StudyHubLogo size={24} />
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '17px', lineHeight: 1, userSelect: 'none' }}>
            <span style={{ color: c.text }}>Study</span>
            <span style={{ color: '#0EA5E9' }}>Hub</span>
          </span>
        </div>

        {/* Dark / Light toggle */}
        <button
          onClick={onToggleDark}
          aria-label="Toggle dark mode"
          style={{
            width: '44px', height: '24px', borderRadius: '12px',
            background: isDark ? '#0EA5E9' : '#64748B',
            border: 'none', cursor: 'pointer', position: 'relative', padding: 0, flexShrink: 0,
          }}
        >
          <span style={{
            position: 'absolute', top: '3px',
            left: isDark ? '23px' : '3px',
            width: '18px', height: '18px', borderRadius: '50%',
            background: '#fff', display: 'block', transition: 'left 0.15s ease',
          }} />
        </button>
      </div>

      {/* ═══════════════════════════════════════
          BOTTOM NAV BAR — Mobile (<768px)
      ═══════════════════════════════════════ */}
      <nav className="bottom-navbar" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '64px',
        background: c.navBg,
        borderTop: `1px solid ${c.navBorder}`,
        display: 'flex', alignItems: 'stretch',
        zIndex: 1000,
        fontFamily: 'Outfit, sans-serif',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {navLinks.map(({ page, label, Icon }) => {
          const isActive = activePage === page;
          return (
            <button key={page} onClick={() => onNavigate(page)} style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '3px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: isActive ? '#0EA5E9' : c.muted,
              position: 'relative', transition: 'color 0.15s',
              padding: '8px 0 6px',
            }}>
              {isActive && (
                <span style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: '24px', height: '3px', borderRadius: '0 0 3px 3px',
                  background: '#0EA5E9',
                }} />
              )}
              <Icon size={22} color={isActive ? '#0EA5E9' : c.muted} />
              <span style={{
                fontFamily: 'Outfit, sans-serif', fontSize: '10px', fontWeight: isActive ? 600 : 400,
                color: isActive ? '#0EA5E9' : c.muted, lineHeight: 1,
              }}>
                {label}
              </span>
            </button>
          );
        })}

        {/* Profile tab */}
        <button onClick={() => setProfileSheetOpen(true)} style={{
          flex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '3px',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px 0 6px',
        }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '50%',
            background: userPhoto ? 'transparent' : '#0EA5E9',
            overflow: 'hidden', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '9px', fontWeight: 600,
          }}>
            {userPhoto
              ? <img src={userPhoto} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials}
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '10px', fontWeight: 400, color: c.muted, lineHeight: 1 }}>
            Profil
          </span>
        </button>
      </nav>

      {/* ═══════════════════════════════════════
          PROFILE BOTTOM SHEET — Mobile
          (toggle tema sudah dipindah ke header,
           jadi tidak ada di sini lagi)
      ═══════════════════════════════════════ */}
      {profileSheetOpen && (
        <>
          <div onClick={() => setProfileSheetOpen(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1100,
          }} className="bottom-sheet-backdrop" />

          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: c.navBg,
            borderRadius: '20px 20px 0 0',
            zIndex: 1101,
            fontFamily: 'Outfit, sans-serif',
            paddingBottom: 'env(safe-area-inset-bottom)',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
          }} className="bottom-sheet">

            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', paddingBottom: '4px' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: isDark ? '#3F3F46' : '#CBD5E1' }} />
            </div>

            {/* Close button */}
            <button onClick={() => setProfileSheetOpen(false)} style={{
              position: 'absolute', top: '12px', right: '16px',
              width: '30px', height: '30px', borderRadius: '50%',
              background: isDark ? '#27272A' : '#F1F5F9',
              border: 'none', cursor: 'pointer', color: c.muted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <X size={16} />
            </button>

            {/* User info */}
            <div style={{ padding: '16px 20px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Avatar size={52} fontSize={18} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: c.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
                <div style={{ fontSize: '13px', color: c.muted, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</div>
              </div>
            </div>

            <div style={{ height: '1px', background: c.navBorder, margin: '0 20px' }} />

            {/* Menu items */}
            <div style={{ padding: '8px 12px' }}>
              <button onClick={() => { setProfileSheetOpen(false); onEditProfile(); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 12px', background: 'none', border: 'none', borderRadius: '12px',
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                  color: c.text, textAlign: 'left',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = isDark ? '#27272A' : '#F8FAFC')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: isDark ? '#27272A' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={18} color={c.muted} />
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '14px', color: c.text }}>Edit Profil</div>
                  <div style={{ fontSize: '12px', color: c.muted, marginTop: '1px' }}>Ubah nama, foto, dan password</div>
                </div>
              </button>

              <button onClick={() => { setProfileSheetOpen(false); onLogout(); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 12px', background: 'none', border: 'none', borderRadius: '12px',
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                  color: '#EF4444', textAlign: 'left',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <LogOut size={18} color="#EF4444" />
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '14px', color: '#EF4444' }}>Keluar</div>
                  <div style={{ fontSize: '12px', color: '#F87171', marginTop: '1px' }}>Logout dari akun ini</div>
                </div>
              </button>
            </div>

            <div style={{ height: '20px' }} />
          </div>
        </>
      )}

      <style>{`
        @media (min-width: 768px) {
          .top-navbar           { display: flex !important; }
          .mobile-top-header    { display: none !important; }
          .bottom-navbar        { display: none !important; }
          .bottom-sheet-backdrop{ display: none !important; }
          .bottom-sheet         { display: none !important; }
        }
        @media (max-width: 767px) {
          .top-navbar           { display: none !important; }
          .mobile-top-header    { display: flex !important; }
          .bottom-navbar        { display: flex !important; }
        }
      `}</style>
    </>
  );
}