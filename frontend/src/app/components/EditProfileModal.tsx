import { useState, useRef } from "react";
import axios from "axios";
import { Camera, Eye, EyeOff, Check, X, User, Lock, Bell, ArrowLeft } from "lucide-react";
import { toast, Toaster } from "sonner";
import { StudyHubLogo } from "./logo"; // Memanggil logo yang kita buat
import { API_URL, SOCKET_URL } from '../config';

type Tab = "profil" | "keamanan" | "notifikasi";

interface ProfileData {
  namaLengkap: string;
  email: string;
}

interface PasswordData {
  passwordLama: string;
  passwordBaru: string;
  konfirmasiPassword: string;
}

interface EditProfileModalProps {
  isDark: boolean;
  currentName: string;
  currentEmail?: string; // Opsional jika ingin ditampilkan
  currentPhoto?: string; // Foto profil yang sudah tersimpan sebelumnya
  onClose: () => void;
  onSuccess: (data: { name: string; photo?: string }) => void;
}

export function EditProfileModal({ currentName, currentEmail = "", currentPhoto, onClose, onSuccess }: EditProfileModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [avatarSrc, setAvatarSrc] = useState<string | null>(currentPhoto ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hanya menyimpan Nama & Email sesuai database asli
  const [profile, setProfile] = useState<ProfileData>({
    namaLengkap: currentName,
    email: currentEmail,
  });

  const [passwords, setPasswords] = useState<PasswordData>({
    passwordLama: "",
    passwordBaru: "",
    konfirmasiPassword: "",
  });

  const [showPass, setShowPass] = useState({
    lama: false,
    baru: false,
    konfirmasi: false,
  });

  const [notifications, setNotifications] = useState({
    tugasBaru: true,
    deadlineDekat: true,
    pesanBaru: false,
    updateSistem: true,
    temanOnline: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  // --- FUNGSI UPLOAD GAMBAR ---
  const handleFileChange = (selected: File) => {
    if (!selected.type.startsWith("image/")) {
      toast.error("File harus berupa gambar!");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setAvatarSrc(e.target?.result as string);
    reader.readAsDataURL(selected);
    setFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileChange(droppedFile);
  };

  // --- FUNGSI SAVE PROFIL KE MYSQL ---
  const handleSaveProfile = async () => {
    if (profile.namaLengkap.trim().length < 3) {
      toast.error("Nama minimal 3 karakter");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      // HANYA mengirim nama dan foto sesuai database asli
      formData.append("nama_lengkap", profile.namaLengkap);
      if (file) {
        formData.append("foto_profil", file);
      }

      const res = await axios.put(`${API_URL}/api/auth/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Profil berhasil diperbarui!");
      const fotoProfil = res.data?.foto_profil;
      onSuccess({
        name: profile.namaLengkap,
        photo: fotoProfil ? `${API_URL}/uploads/${fotoProfil}` : avatarSrc || undefined
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setIsSaving(false);
    }
  };

  // --- FUNGSI SAVE PASSWORD KE MYSQL ---
  const handleSavePassword = async () => {
    if (!passwords.passwordLama) {
      toast.error("Masukkan password lama terlebih dahulu.");
      return;
    }
    if (passwords.passwordBaru.length < 6) {
      toast.error("Password baru minimal 6 karakter.");
      return;
    }
    if (passwords.passwordBaru !== passwords.konfirmasiPassword) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("password", passwords.passwordBaru);

      await axios.put(`${API_URL}/api/auth/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Password berhasil diperbarui!");
      setPasswords({ passwordLama: "", passwordBaru: "", konfirmasiPassword: "" });
    } catch (error: any) {
      toast.error("Gagal memperbarui password");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = profile.namaLengkap
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "profil", label: "Profil", icon: <User size={16} /> },
    { key: "keamanan", label: "Keamanan", icon: <Lock size={16} /> },
    { key: "notifikasi", label: "Notifikasi", icon: <Bell size={16} /> },
  ];

  const passwordStrength = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(passwords.passwordBaru);
  const strengthLabel = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"][strength];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, overflowY: "auto", background: "#f4f6f9", fontFamily: "Outfit, sans-serif" }}>
      <Toaster position="top-center" richColors />
      
      {/* Navbar (Kembali ke desain Logo Awal) */}
      <header
        className="flex items-center justify-between px-8 py-4"
        style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.07)", position: "sticky", top: 0, zIndex: 100 }}
      >
        <div className="flex items-center gap-2">
          <StudyHubLogo size={32} />
          <span style={{ fontWeight: 700, fontSize: 22, fontFamily: "Syne, sans-serif", lineHeight: 1 }}>
            <span style={{ color: "#1a1a2e" }}>Study</span>
            <span style={{ color: "#0ea5e9" }}>Hub</span>
          </span>
        </div>

        <nav className="flex items-center gap-8">
          <button
            onClick={onClose}
            className="flex items-center gap-2"
            style={{
              color: "#0ea5e9",
              background: "rgba(14, 165, 233, 0.1)",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              padding: "8px 16px",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              transition: "background 0.2s"
            }}
          >
            <ArrowLeft size={16} /> Kembali ke Aplikasi
          </button>
        </nav>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 style={{ color: "#1a1a2e", marginBottom: 4, fontSize: "24px", fontFamily: "Syne, sans-serif", fontWeight: 700 }}>Pengaturan Akun</h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            Kelola informasi profil dan preferensi akun kamu
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div
            style={{
              width: 200, background: "#fff", borderRadius: 16, padding: 8, height: "fit-content",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)", flexShrink: 0,
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-3 w-full"
                style={{
                  padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontFamily: "Outfit, sans-serif",
                  background: activeTab === tab.key ? "#eff6ff" : "transparent",
                  color: activeTab === tab.key ? "#0ea5e9" : "#6b7280",
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  transition: "all 0.15s", marginBottom: 2,
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* ─── PROFIL TAB ─── */}
            {activeTab === "profil" && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <h2 style={{ color: "#1a1a2e", marginBottom: 4, fontSize: "18px", fontFamily: "Syne, sans-serif", fontWeight: 700 }}>Informasi Profil</h2>
                <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28 }}>
                  Perbarui foto dan nama tampilan kamu
                </p>

                {/* Avatar Upload */}
                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div style={{ position: "relative" }}>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      style={{
                        width: 96, height: 96, borderRadius: "50%", overflow: "hidden",
                        border: isDragging ? "3px dashed #0ea5e9" : "3px solid #e5e7eb",
                        cursor: "pointer", position: "relative", background: "#f3f4f6",
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {avatarSrc ? (
                        <img src={avatarSrc} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div
                          style={{
                            width: "100%", height: "100%", background: "linear-gradient(135deg, #0ea5e9, #22d3ee)",
                            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 28, fontFamily: "Outfit, sans-serif"
                          }}
                        >
                          {initials}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%",
                        background: "#0ea5e9", border: "2px solid #fff", display: "flex", alignItems: "center",
                        justifyContent: "center", cursor: "pointer",
                      }}
                    >
                      <Camera size={13} color="#fff" />
                    </button>
                  </div>

                  <input
                    ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  />

                  <div>
                    <p style={{ color: "#1a1a2e", fontWeight: 500, marginBottom: 4 }}>Foto Profil</p>
                    <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 8 }}>JPG, PNG. Maks. 5MB</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          padding: "6px 14px", borderRadius: 8, border: "1px solid #0ea5e9", background: "transparent",
                          color: "#0ea5e9", cursor: "pointer", fontSize: 13, fontFamily: "Outfit, sans-serif"
                        }}
                      >
                        Ganti Foto
                      </button>
                      {avatarSrc && (
                        <button
                          onClick={() => { setAvatarSrc(null); setFile(null); }}
                          style={{
                            padding: "6px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "transparent",
                            color: "#6b7280", cursor: "pointer", fontSize: 13, fontFamily: "Outfit, sans-serif"
                          }}
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Fields (Hanya Nama & Email) */}
                <div className="flex flex-col gap-5">
                  <Field
                    label="Nama Lengkap"
                    value={profile.namaLengkap}
                    onChange={(v) => setProfile({ ...profile, namaLengkap: v })}
                    placeholder="Masukkan nama lengkap"
                  />
                  <Field
                    label="Email (Tidak dapat diubah)"
                    type="email"
                    value={profile.email}
                    onChange={() => {}} // Sengaja dikunci
                    placeholder="email@contoh.com"
                    disabled={true}
                  />
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={onClose}
                    style={{
                      padding: "10px 22px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff",
                      color: "#6b7280", cursor: "pointer", fontFamily: "Outfit, sans-serif"
                    }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    style={{
                      padding: "10px 22px", borderRadius: 10, border: "none",
                      background: isSaving ? "#93c5fd" : "linear-gradient(135deg, #0ea5e9, #22d3ee)",
                      color: "#fff", cursor: isSaving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6,
                      fontFamily: "Outfit, sans-serif", fontWeight: 500
                    }}
                  >
                    {isSaving ? "Menyimpan..." : <><Check size={15} /> Simpan Perubahan</>}
                  </button>
                </div>
              </div>
            )}

            {/* ─── KEAMANAN TAB ─── */}
            {activeTab === "keamanan" && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <h2 style={{ color: "#1a1a2e", marginBottom: 4, fontSize: "18px", fontFamily: "Syne, sans-serif", fontWeight: 700 }}>Keamanan Akun</h2>
                <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28 }}>
                  Perbarui password untuk menjaga keamanan akun kamu
                </p>

                <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                  <Lock size={18} color="#0ea5e9" />
                  <p style={{ color: "#0369a1", fontSize: 13 }}>
                    Disarankan untuk mengganti password secara berkala.
                  </p>
                </div>

                <div className="flex flex-col gap-5" style={{ maxWidth: 480 }}>
                  <PasswordField
                    label="Password Lama"
                    value={passwords.passwordLama}
                    onChange={(v) => setPasswords({ ...passwords, passwordLama: v })}
                    show={showPass.lama}
                    onToggle={() => setShowPass({ ...showPass, lama: !showPass.lama })}
                    placeholder="Masukkan password lama"
                  />
                  <PasswordField
                    label="Password Baru"
                    value={passwords.passwordBaru}
                    onChange={(v) => setPasswords({ ...passwords, passwordBaru: v })}
                    show={showPass.baru}
                    onToggle={() => setShowPass({ ...showPass, baru: !showPass.baru })}
                    placeholder="Minimal 6 karakter"
                  />

                  {passwords.passwordBaru && (
                    <div>
                      <div className="flex gap-1" style={{ marginBottom: 6 }}>
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= strength ? strengthColor : "#e5e7eb", transition: "background 0.3s" }} />
                        ))}
                      </div>
                      <p style={{ fontSize: 12, color: strengthColor, fontWeight: 500 }}>{strengthLabel}</p>
                    </div>
                  )}

                  <PasswordField
                    label="Konfirmasi Password Baru"
                    value={passwords.konfirmasiPassword}
                    onChange={(v) => setPasswords({ ...passwords, konfirmasiPassword: v })}
                    show={showPass.konfirmasi}
                    onToggle={() => setShowPass({ ...showPass, konfirmasi: !showPass.konfirmasi })}
                    placeholder="Ulangi password baru"
                    error={passwords.konfirmasiPassword && passwords.passwordBaru !== passwords.konfirmasiPassword ? "Password tidak cocok" : ""}
                  />
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={() => setPasswords({ passwordLama: "", passwordBaru: "", konfirmasiPassword: "" })}
                    style={{ padding: "10px 22px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", cursor: "pointer", fontFamily: "Outfit, sans-serif" }}
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleSavePassword}
                    disabled={isSaving}
                    style={{
                      padding: "10px 22px", borderRadius: 10, border: "none", background: isSaving ? "#93c5fd" : "linear-gradient(135deg, #0ea5e9, #22d3ee)",
                      color: "#fff", cursor: isSaving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "Outfit, sans-serif", fontWeight: 500
                    }}
                  >
                    {isSaving ? "Menyimpan..." : <><Check size={15} /> Perbarui Password</>}
                  </button>
                </div>
              </div>
            )}

            {/* ─── NOTIFIKASI TAB ─── */}
            {activeTab === "notifikasi" && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <h2 style={{ color: "#1a1a2e", marginBottom: 4, fontSize: "18px", fontFamily: "Syne, sans-serif", fontWeight: 700 }}>Preferensi Notifikasi</h2>
                <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28 }}>
                  Pilih jenis notifikasi yang ingin kamu terima
                </p>

                {[
                  { key: "tugasBaru", label: "Tugas Baru", desc: "Notifikasi saat ada tugas baru ditambahkan" },
                  { key: "deadlineDekat", label: "Deadline Mendekat", desc: "Pengingat 24 jam sebelum deadline" },
                  { key: "pesanBaru", label: "Pesan Baru", desc: "Notifikasi saat ada pesan dari teman" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between" style={{ padding: "16px 0", borderBottom: "1px solid #f3f4f6" }}>
                    <div>
                      <p style={{ color: "#1a1a2e", fontWeight: 500, marginBottom: 2 }}>{item.label}</p>
                      <p style={{ color: "#6b7280", fontSize: 13 }}>{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      style={{
                        width: 44, height: 24, borderRadius: 12, border: "none", background: notifications[item.key as keyof typeof notifications] ? "#0ea5e9" : "#e5e7eb",
                        cursor: "pointer", position: "relative", transition: "background 0.25s", flexShrink: 0,
                      }}
                    >
                      <span style={{ position: "absolute", top: 3, left: notifications[item.key as keyof typeof notifications] ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.25s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                    </button>
                  </div>
                ))}

                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => toast.success("Preferensi notifikasi disimpan!")}
                    style={{
                      padding: "10px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #0ea5e9, #22d3ee)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "Outfit, sans-serif", fontWeight: 500
                    }}
                  >
                    <Check size={15} /> Simpan Preferensi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        input:focus, textarea:focus, select:focus { border-color: #0ea5e9 !important; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
      `}</style>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, prefix, disabled = false }: any) {
  return (
    <div>
      <label style={{ display: "block", color: "#374151", fontSize: 14, marginBottom: 6, fontWeight: 500 }}>{label}</label>
      <div style={{ position: "relative" }}>
        {prefix && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 14, pointerEvents: "none" }}>{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: "100%", padding: prefix ? "10px 14px 10px 28px" : "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", 
            background: disabled ? "#f3f4f6" : "#f9fafb", fontSize: 14, color: disabled ? "#9ca3af" : "#1a1a2e", outline: "none", boxSizing: "border-box", transition: "border-color 0.15s, box-shadow 0.15s", fontFamily: "Outfit, sans-serif"
          }}
        />
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, placeholder, error }: any) {
  return (
    <div>
      <label style={{ display: "block", color: "#374151", fontSize: 14, marginBottom: 6, fontWeight: 500 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width: "100%", padding: "10px 44px 10px 14px", borderRadius: 10, border: `1px solid ${error ? "#ef4444" : "#e5e7eb"}`, background: "#f9fafb", fontSize: 14, color: "#1a1a2e", outline: "none", boxSizing: "border-box", transition: "border-color 0.15s, box-shadow 0.15s", fontFamily: "Outfit, sans-serif" }}
        />
        <button
          type="button"
          onClick={onToggle}
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex" }}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}