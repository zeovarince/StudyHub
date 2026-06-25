import { useState, useRef, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import { type Page, colors } from '../types';
import { StudyHubLogo } from './Logo';

interface NavbarProps {
  isDark: boolean;
  onToggleDark: () => void;
  activePage: Page;
  onNavigate: (page: Page) => void;
  userName: string;
  userEmail: string;
  onLogout: () => void;
  onEditProfile: () => void; // <--- Sudah kutambahkan tipe datanya di sini
}

const navLinks: Page[] = ['Dashboard', 'Tugas', 'Teman', 'Musik'];

export function Navbar({ isDark, onToggleDark, activePage, onNavigate, userName, userEmail, onLogout, onEditProfile }: NavbarProps) {
  const c = colors(isDark);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = userName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        background: c.navBg,
        borderBottom: `1px solid ${c.navBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        zIndex: 1000,
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <StudyHubLogo size={28} />
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', lineHeight: 1, userSelect: 'none' }}>
          <span style={{ color: c.text }}>Study</span>
          <span style={{ color: '#0EA5E9' }}>Hub</span>
        </span>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {navLinks.map(link => (
          <button
            key={link}
            onClick={() => onNavigate(link)}
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              color: activePage === link ? '#0EA5E9' : c.muted,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0 8px 0',
              position: 'relative',
              transition: 'color 0.15s',
            }}
          >
            {link}
            {activePage === link && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '0px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#0EA5E9',
                  display: 'block',
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Right: Toggle + Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Dark/Light Toggle */}
        <button
          onClick={onToggleDark}
          aria-label="Toggle dark mode"
          style={{
            width: '44px',
            height: '24px',
            borderRadius: '12px',
            background: isDark ? '#0EA5E9' : '#64748B',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '3px',
              left: isDark ? '23px' : '3px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#FFFFFF',
              display: 'block',
              transition: 'left 0.15s ease',
            }}
          />
        </button>

        {/* Avatar + Dropdown */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#0EA5E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 600,
              fontSize: '12px',
              flexShrink: 0,
              border: menuOpen ? '2px solid rgba(14,165,233,0.4)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'border 0.15s',
            }}
          >
            {initials}
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '220px',
                background: c.navBg,
                border: `1px solid ${c.navBorder}`,
                borderRadius: '10px',
                boxShadow: isDark
                  ? '0 8px 24px rgba(0,0,0,0.4)'
                  : '0 8px 24px rgba(15,23,42,0.10)',
                overflow: 'hidden',
                zIndex: 100,
              }}
            >
              {/* User Info */}
              <div
                style={{
                  padding: '14px 16px',
                  borderBottom: `1px solid ${c.navBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#0EA5E9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 600,
                    fontSize: '13px',
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 600,
                      fontSize: '13px',
                      color: c.text,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {userName}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '11px',
                      color: c.muted,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {userEmail}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ padding: '6px' }}>
                
                {/* Tombol Profil Saya yang sudah disambungkan ke Edit Profil */}
                <button
                  onClick={() => {
                    setMenuOpen(false); // Tutup dropdown
                    onEditProfile();    // Munculkan Modal
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 10px',
                    background: 'none',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '13px',
                    color: c.muted,
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = isDark ? '#27272A' : '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <User size={15} />
                  Profil Saya
                </button>

                <div style={{ height: '1px', background: c.navBorder, margin: '4px 0' }} />

                <button
                  onClick={() => { setMenuOpen(false); onLogout(); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 10px',
                    background: 'none',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '13px',
                    color: '#EF4444',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <LogOut size={15} />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}