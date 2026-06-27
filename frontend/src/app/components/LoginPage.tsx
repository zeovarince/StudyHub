import { useState } from 'react';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { colors } from '../types';
import axios from 'axios';

interface LoginPageProps {
  isDark: boolean;
  onToggleDark: () => void;
  onLogin: (email: string, name: string, photo?: string) => void;
  onGoRegister: () => void;
}

export function LoginPage({ isDark, onToggleDark, onLogin, onGoRegister }: LoginPageProps) {
  const c = colors(isDark);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Format email tidak valid';
    if (!password) e.password = 'Password wajib diisi';
    else if (password.length < 6) e.password = 'Password minimal 6 karakter';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);

      const photoUrl = user.foto_profil ? `http://localhost:5000/uploads/${user.foto_profil}` : undefined;
      onLogin(user.email, user.nama_lengkap, photoUrl);
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrors({ email: error.response.data.message });
      } else {
        setErrors({ email: 'Terjadi kesalahan pada server' });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputWrap: React.CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    height: '44px',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    color: c.text,
    background: c.inputBg,
    border: `1px solid ${hasError ? '#EF4444' : c.inputBorder}`,
    borderRadius: '8px',
    padding: '0 14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: 500,
    fontSize: '13px',
    color: c.muted,
    marginBottom: '6px',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: isDark ? '#09090B' : '#F8FAFC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'Outfit, sans-serif',
        position: 'relative',
      }}
    >
      {/* Dark mode toggle */}
      <button
        onClick={onToggleDark}
        aria-label="Toggle dark mode"
        style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: isDark ? '#27272A' : '#FFFFFF',
          border: `1px solid ${c.inputBorder}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: c.muted,
        }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '28px', lineHeight: 1 }}>
            <span style={{ color: c.text }}>Study</span>
            <span style={{ color: '#0EA5E9' }}>Hub</span>
          </span>
          <p style={{ color: c.muted, fontSize: '14px', margin: '8px 0 0 0' }}>
            Platform belajar kolaboratif untuk mahasiswa
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: isDark ? '#18181B' : '#FFFFFF',
            border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            borderRadius: '16px',
            padding: '28px',
          }}
        >
          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              color: c.text,
              margin: '0 0 4px 0',
            }}
          >
            Masuk ke akun
          </h2>
          <p style={{ color: c.muted, fontSize: '13px', margin: '0 0 24px 0' }}>
            Selamat datang kembali!
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Email */}
              <div>
                <label style={labelStyle}>Email</label>
                <div style={inputWrap}>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                    style={inputStyle(!!errors.email)}
                  />
                </div>
                {errors.email && (
                  <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '12px',
                      color: '#0EA5E9',
                      padding: 0,
                    }}
                  >
                    Lupa password?
                  </button>
                </div>
                <div style={{ ...inputWrap }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                    style={{ ...inputStyle(!!errors.password), paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: c.muted,
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: '44px',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#FFFFFF',
                  background: loading ? '#7DD3FC' : '#0EA5E9',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '4px',
                  transition: 'background 0.15s',
                }}
              >
                {loading ? 'Masuk...' : 'Masuk'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '20px 0',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: c.inputBorder }} />
            <span style={{ fontSize: '12px', color: c.muted }}>atau</span>
            <div style={{ flex: 1, height: '1px', background: c.inputBorder }} />
          </div>

          {/* Demo login */}
          <button
            type="button"
            onClick={() => onLogin('demo@studyhub.id', 'Arkan')}
            style={{
              width: '100%',
              height: '40px',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              fontSize: '13px',
              color: c.text,
              background: 'none',
              border: `1px solid ${c.inputBorder}`,
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Masuk dengan akun demo
          </button>

          {/* Register link */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: c.muted, margin: '20px 0 0 0' }}>
            Belum punya akun?{' '}
            <button
              type="button"
              onClick={onGoRegister}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                color: '#0EA5E9',
                fontWeight: 500,
                padding: 0,
              }}
            >
              Daftar sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}