import { useEffect, useState } from 'react';
interface ProfilePageProps {
  isDark: boolean;
}
const ProfilePage = () => {
  const [profile, setProfile] = useState<{
    nama_lengkap: string;
    email: string;
    created_at: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/profile/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setProfile(data.user);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat profil');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen"
         style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-secondary)' }}>
      Memuat profil...
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen"
         style={{ fontFamily: 'Outfit, sans-serif', color: '#EF4444' }}>
      {error}
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '2rem',
                  fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto',
                    backgroundColor: 'var(--bg-card)', borderRadius: '16px',
                    padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%',
                        backgroundColor: '#0EA5E9', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', fontWeight: 700,
                        fontFamily: 'Syne, sans-serif', color: '#fff' }}>
            {profile?.nama_lengkap?.charAt(0).toUpperCase()}
          </div>
        </div>

        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.5rem',
                     textAlign: 'center', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          {profile?.nama_lengkap}
        </h1>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)',
                    fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          {profile?.email}
        </p>

        <hr style={{ borderColor: 'var(--text-secondary)', opacity: 0.2, marginBottom: '1.5rem' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between',
                      color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <span>Bergabung sejak</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
            {new Date(profile?.created_at ?? '').toLocaleDateString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </span>
        </div>

      </div>
    </div>
  );
};

export { ProfilePage };