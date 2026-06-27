import { useState } from 'react';
import { Eye, EyeOff, Sun, Moon, Check } from 'lucide-react';
import { colors } from '../types';
import axios from 'axios';
import { API_URL, SOCKET_URL } from '../config';

interface RegisterPageProps {
  isDark: boolean;
  onToggleDark: () => void;
  onRegister: (email: string, name: string) => void;
  onGoLogin: () => void;
}

export function RegisterPage({ isDark, onToggleDark, onRegister, onGoLogin }: RegisterPageProps) {
  const c = colors(isDark);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const strengthChecks = [
    { label: 'Minimal 8 karakter', pass: password.length >= 8 },
    { label: 'Huruf besar', pass: /[A-Z]/.test(password) },
    { label: 'Angka', pass: /[0-9]/.test(password) },
  ];
  const strength = strengthChecks.filter(s => s.pass).length;
  const strengthColor = strength === 0 ? '#E2E8F0' : strength === 1 ? '#EF4444' : strength === 2 ? '#F97316' : '#10B981';
  const strengthLabel = strength === 0 ? '' : strength === 1 ? 'Lemah' : strength === 2 ? 'Sedang' : 'Kuat';

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Nama wajib diisi';
    if (!email.trim()) e.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Format email tidak valid';
    if (!password) e.password = 'Password wajib diisi';
    else if (password.length < 6) e.password = 'Password minimal 6 karakter';
    if (!confirm) e.confirm = 'Konfirmasi password wajib diisi';
    else if (confirm !== password) e.confirm = 'Password tidak cocok';
    if (!agreed) e.agreed = 'Kamu harus menyetujui syarat & ketentuan';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        nama_lengkap: name,
        email: email,
        password: password
      });
      alert('Registrasi sukses! Silakan masuk dengan akun barumu.');
      onGoLogin();
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrors({ email: error.response.data.message });
      } else {
        setErrors({ email: 'Terjadi kesalahan saat mendaftar' });
      }
    } finally {
      setLoading(false);
    }
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

      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '28px', lineHeight: 1 }}>
            <span style={{ color: c.text }}>Study</span>
            <span style={{ color: '#0EA5E9' }}>Hub</span>
          </span>
          <p style={{ color: c.muted, fontSize: '14px', margin: '8px 0 0 0' }}>
            Bergabung dan mulai belajar bersama
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
            Buat akun baru
          </h2>
          <p style={{ color: c.muted, fontSize: '13px', margin: '0 0 24px 0' }}>
            Isi data di bawah untuk mendaftar
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Nama */}
              <div>
                <label style={labelStyle}>Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Contoh: Arkan Kusuma"
                  value={name}
                  onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
                  style={inputStyle(!!errors.name)}
                />
                {errors.name && (
                  <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                  style={inputStyle(!!errors.email)}
                />
                {errors.email && (
                  <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter"
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

                {/* Password strength */}
                {password.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                      {[1, 2, 3].map(i => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: '3px',
                            borderRadius: '2px',
                            background: i <= strength ? strengthColor : (isDark ? '#3F3F46' : '#E2E8F0'),
                            transition: 'background 0.2s',
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {strengthChecks.map(check => (
                        <span
                          key={check.label}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontSize: '11px',
                            color: check.pass ? '#10B981' : c.muted,
                          }}
                        >
                          <Check size={10} />
                          {check.label}
                        </span>
                      ))}
                      {strengthLabel && (
                        <span style={{ fontSize: '11px', color: strengthColor, fontWeight: 500, marginLeft: 'auto' }}>
                          {strengthLabel}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {errors.password && (
                  <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label style={labelStyle}>Konfirmasi Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Ulangi password"
                    value={confirm}
                    onChange={e => { setConfirm(e.target.value); setErrors(prev => ({ ...prev, confirm: '' })); }}
                    style={{ ...inputStyle(!!errors.confirm), paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
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
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirm && (
                  <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                    {errors.confirm}
                  </span>
                )}
              </div>

              {/* Terms */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    onClick={() => { setAgreed(!agreed); setErrors(prev => ({ ...prev, agreed: '' })); }}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: `1.5px solid ${errors.agreed ? '#EF4444' : agreed ? '#0EA5E9' : c.inputBorder}`,
                      background: agreed ? '#0EA5E9' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '1px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {agreed && <Check size={11} color="#FFFFFF" />}
                  </div>
                  <span style={{ fontSize: '13px', color: c.muted, lineHeight: 1.5 }}>
                    Saya menyetujui{' '}
                    <span style={{ color: '#0EA5E9', cursor: 'pointer' }}>Syarat & Ketentuan</span>{' '}
                    dan{' '}
                    <span style={{ color: '#0EA5E9', cursor: 'pointer' }}>Kebijakan Privasi</span>{' '}
                    StudyHub
                  </span>
                </label>
                {errors.agreed && (
                  <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                    {errors.agreed}
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
                {loading ? 'Mendaftar...' : 'Buat Akun'}
              </button>
            </div>
          </form>

          {/* Login link */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: c.muted, margin: '20px 0 0 0' }}>
            Sudah punya akun?{' '}
            <button
              type="button"
              onClick={onGoLogin}
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
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
