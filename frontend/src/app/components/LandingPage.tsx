import { useState } from "react";
import {
  Sun,
  Moon,
  ArrowRight,
  Kanban,
  Users,
  Music,
  Clock,
  Paperclip,
  Monitor,
  Bot,
  Menu,
  X,
  Import,
} from "lucide-react";
import SplashCursor from "./SplashCursor";
import MetaBalls from "./MetaBalls";

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.9.57.1.78-.25.78-.55v-2.17c-3.2.7-3.88-1.39-3.88-1.39-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.74.4-1.26.73-1.55-2.55-.29-5.23-1.27-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.2.65.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
}

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

interface LandingPageProps {
  isDark: boolean;
  onToggleDark: () => void;
  onGoLogin: () => void;
  onGoRegister: () => void;
}

export function LandingPage({
  isDark,
  onToggleDark,
  onGoLogin,
  onGoRegister,
}: LandingPageProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const bg = isDark ? "#09090B" : "#F8FAFC";
  const card = isDark ? "#18181B" : "#FFFFFF";
  const card2 = isDark ? "#1C1C1F" : "#F1F5F9";
  const text = isDark ? "#FAFAFA" : "#0F172A";
  const muted = isDark ? "#71717A" : "#64748B";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const sky = "#0EA5E9";
  const skyDim = isDark ? "rgba(14,165,233,0.12)" : "rgba(14,165,233,0.08)";

  const features = [
    {
      icon: <Kanban size={20} color={sky} />,
      title: "Kanban Board",
      desc: "Tiga kolom Belum, Proses, Selesai. Geser kartu tugas dan lihat progresmu secara visual.",
    },
    {
      icon: <Users size={20} color={sky} />,
      title: "Invite Teman",
      desc: "Tambahkan teman ke tugas kelompok, pantau siapa mengerjakan apa tanpa grup WA yang penuh notif.",
    },
    {
      icon: <Music size={20} color={sky} />,
      title: "Musik Belajar",
      desc: "Putar lo-fi atau musik fokus langsung dari dashboard. Tidak perlu buka tab baru lagi.",
    },
    {
      icon: <Clock size={20} color={sky} />,
      title: "Peringatan Deadline",
      desc: "Kartu tugas menyala merah otomatis saat deadline tinggal satu hari. Tidak ada yang terlewat.",
    },
    {
      icon: <Paperclip size={20} color={sky} />,
      title: "Upload Lampiran",
      desc: "Simpan PDF dan gambar di dalam kartu tugas. Semua referensi dalam satu tempat.",
    },
    {
      icon: <Monitor size={20} color={sky} />,
      title: "Dark & Light Mode",
      desc: "Nyaman dipakai siang maupun malam. Satu klik untuk beralih tema sesuai kondisi matamu.",
    },
    {
      icon: <Bot size={20} color={sky} />,
      title: "Chatbot AI (StudyBot)",
      desc: 'Tanya apa aja, termasuk soal tugasmu sendiri "tugas apa yang belum kelar?" dijawab kontekstual berdasarkan data tugasmu. Ditenagai Gemini 3.5 Flash.',
    },
  ];

  const developers = [
    {
      name: "Ainur Raftuzzaki",
      github: "https://github.com/AinurRaftuzzaki",
      instagram: "https://www.instagram.com/ainr_zky/",
    },
    {
      name: "Muhammad Zaidan Nabil Rafi",
      github: "https://github.com/jaidan2212",
      instagram: "https://www.instagram.com/zdnrfi_/",
    },
    {
      name: "A. Choiril Anwar EL-Asfihani Risydan",
      github: "https://github.com/zeovarince",
      instagram: "https://www.instagram.com/2ez4rielz/",
    },
    {
      name: "Muhammad Izzul Millah Aqil",
      github: "https://github.com/izzulmillahaqil",
      instagram: "https://www.instagram.com/izzulzulzul/",
    },
  ];

  const steps = [
    {
      n: "1",
      title: "Daftar Akun",
      desc: "Buat akun gratis dalam kurang dari satu menit.",
    },
    {
      n: "2",
      title: "Tambah Tugasmu",
      desc: "Isi judul, matkul, deadline, dan undang anggota kelompok.",
    },
    {
      n: "3",
      title: "Pantau & Selesaikan",
      desc: "Geser tugas di papan Kanban saat progres bertambah.",
    },
  ];

  // Fake kanban cards untuk mockup
  const mockCards = {
    belum: [
      {
        title: "UAS Algoritma & Pemrograman",
        sub: "Algoritma",
        pill: "⏰ H-1 hari",
        pillColor: "#f87171",
        pillBg: "rgba(239,68,68,0.12)",
      },
      {
        title: "Makalah Sistem Operasi",
        sub: "Sistem Operasi",
        pill: "📅 H-5 hari",
        pillColor: "#fb923c",
        pillBg: "rgba(249,115,22,0.12)",
      },
    ],
    proses: [
      {
        title: "Laporan Praktikum Jaringan",
        sub: "Jaringan Komputer · 📎 2 file",
        pill: "📅 H-3 hari",
        pillColor: "#fb923c",
        pillBg: "rgba(249,115,22,0.12)",
      },
    ],
    selesai: [
      {
        title: "Quiz Kalkulus Bab 3",
        sub: "Kalkulus",
        pill: "✓ Selesai",
        pillColor: "#34d399",
        pillBg: "rgba(16,185,129,0.12)",
      },
      {
        title: "Essay Bahasa Indonesia",
        sub: "Bahasa Indonesia",
        pill: "✓ Selesai",
        pillColor: "#34d399",
        pillBg: "rgba(16,185,129,0.12)",
      },
    ],
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        fontFamily: "Outfit, sans-serif",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Efek splash cursor biru muda sesuai palet StudyHub, hanya tampil di Landing Page */}
      <SplashCursor />

      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          background: isDark ? "rgba(9,9,11,0.85)" : "rgba(248,250,252,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${border}`,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <rect
              width="48"
              height="48"
              rx="11"
              fill="#0EA5E9"
              fillOpacity="0.12"
            />
            <path
              d="M24 12L12 18V30L24 36L36 30V18L24 12Z"
              stroke="#0EA5E9"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="24" r="4" fill="#0EA5E9" />
            <path
              d="M24 12V20"
              stroke="#0EA5E9"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M12 30L18 26"
              stroke="#0EA5E9"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M36 30L30 26"
              stroke="#0EA5E9"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              color: text,
            }}
          >
            StudyHub
          </span>
        </div>

        {/* Nav right Desktop */}
        <div
          className="landing-nav-desktop"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <button
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: isDark ? "#27272A" : "#FFFFFF",
              border: `1px solid ${border}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: muted,
            }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={onGoLogin}
            style={{
              color: muted,
              fontSize: "14px",
              fontWeight: 400,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px 14px",
              borderRadius: "8px",
              fontFamily: "Outfit, sans-serif",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = muted)}
          >
            Masuk
          </button>
          <button
            onClick={onGoRegister}
            style={{
              background: sky,
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "9px 18px",
              fontFamily: "Outfit, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Daftar Gratis
          </button>
        </div>

        {/* Hamburger Mobile */}
        <div
          className="landing-nav-mobile"
          style={{ display: "none", alignItems: "center", gap: "8px" }}
        >
          <button
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: isDark ? "#27272A" : "#FFFFFF",
              border: `1px solid ${border}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: muted,
            }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Open menu"
            style={{
              width: "36px",
              height: "36px",
              background: "none",
              border: `1px solid ${border}`,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: text,
            }}
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Dropdown */}
      {mobileNavOpen && (
        <div
          className="landing-mobile-dropdown"
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            zIndex: 49,
            background: isDark ? "rgba(9,9,11,0.97)" : "rgba(248,250,252,0.97)",
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${border}`,
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button
            onClick={() => {
              onGoLogin();
              setMobileNavOpen(false);
            }}
            style={{
              width: "100%",
              padding: "14px",
              background: isDark ? "#18181B" : "#FFFFFF",
              border: `1px solid ${border}`,
              borderRadius: "10px",
              fontFamily: "Outfit, sans-serif",
              fontSize: "15px",
              fontWeight: 400,
              color: text,
              cursor: "pointer",
            }}
          >
            Masuk
          </button>
          <button
            onClick={() => {
              onGoRegister();
              setMobileNavOpen(false);
            }}
            style={{
              width: "100%",
              padding: "14px",
              background: sky,
              border: "none",
              borderRadius: "10px",
              fontFamily: "Outfit, sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Daftar Gratis
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .landing-nav-desktop { display: none !important; }
          .landing-nav-mobile { display: flex !important; }
        }
        @media (min-width: 641px) {
          .landing-mobile-dropdown { display: none !important; }
        }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
        @media (max-width: 640px) {
          .steps-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .steps-connector { display: none !important; }
          .footer-bottom-row { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
          .final-cta-card { padding: 32px 20px !important; }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes progress { from{width:0%} to{width:100%} }
      `}</style>

{/* ── HERO ── */}
      <section
        style={{
          paddingTop: "130px",
          paddingBottom: "72px",
          paddingLeft: "24px",
          paddingRight: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Latar Belakang MetaBalls */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        >
          <MetaBalls
            color="#0EA5E9"
            speed={0.4}
            animationSize={25}
            ballCount={12}
            clumpFactor={1.2}
            enableTransparency={true}
          />
        </div>
        
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "480px",
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at center, rgba(14,165,233,0.1) 0%, transparent 65%)",
          }}
        />

        {/* BUNGKUSAN KONTEN UTAMA (Z-INDEX: 2 AGAR DI DEPAN METABALLS) */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              background: skyDim,
              border: `1px solid rgba(14,165,233,0.22)`,
              borderRadius: "100px",
              padding: "5px 14px 5px 10px",
              fontSize: "12px",
              fontWeight: 500,
              color: sky,
              marginBottom: "28px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: sky,
                animation: "blink-hero 2.2s ease-in-out infinite",
              }}
            />
            Sistem Manajemen Tugas Mahasiswa · UTM
          </div>

          <style>{`
            @keyframes blink-hero { 0%,100%{opacity:1} 50%{opacity:0.3} }
          `}</style>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(38px, 6vw, 72px)",
              lineHeight: 1.07,
              letterSpacing: "-0.025em",
              maxWidth: "800px",
              marginBottom: "20px",
              color: text,
            }}
          >
            Satu ruang kerja untuk{" "}
            <span style={{ color: sky }}>semua tugasmu.</span>
          </h1>

          <p
            style={{
              color: muted,
              fontSize: "16px",
              lineHeight: 1.75,
              maxWidth: "440px",
              marginBottom: "36px",
            }}
          >
            Kelola tugas kuliah dengan papan Kanban, kerjakan bareng teman, putar
            musik belajar, dan pantau deadline semuanya dalam satu dashboard.
          </p>

          {/* CTA */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "64px",
            }}
          >
            <button
              onClick={onGoRegister}
              style={{
                background: sky,
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "13px 26px",
                fontFamily: "Outfit, sans-serif",
                fontSize: "15px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "opacity 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.85";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Daftar Sekarang Gratis <ArrowRight size={15} />
            </button>

            <button
              onClick={onGoLogin}
              style={{
                background: "transparent",
                color: muted,
                border: `1px solid ${border}`,
                borderRadius: "10px",
                padding: "13px 26px",
                fontFamily: "Outfit, sans-serif",
                fontSize: "15px",
                fontWeight: 400,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = text;
                e.currentTarget.style.background = card;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = muted;
                e.currentTarget.style.background = "transparent";
              }}
            >
              Sudah punya akun? Masuk
            </button>
          </div>

          {/* ── APP MOCKUP ── */}
          <div style={{ width: "100%", maxWidth: "860px", position: "relative" }}>
            <div
              style={{
                background: card,
                border: `1px solid ${border}`,
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              {/* Browser chrome */}
              <div
                style={{
                  background: card2,
                  borderBottom: `1px solid ${border}`,
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#EF4444",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#F97316",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#10B981",
                    display: "inline-block",
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    background: isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.04)",
                    border: `1px solid ${border}`,
                    borderRadius: "6px",
                    padding: "4px 12px",
                    fontSize: "11px",
                    color: muted,
                    textAlign: "center",
                    maxWidth: "260px",
                    margin: "0 auto",
                  }}
                >
                  localhost:5173 — StudyHub
                </div>
              </div>

              {/* App navbar */}
              <div
                style={{
                  background: card2,
                  borderBottom: `1px solid ${border}`,
                  padding: "0 20px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: sky,
                  }}
                >
                  StudyHub
                </span>
                <div style={{ display: "flex", gap: "4px" }}>
                  {["Dashboard", "Tugas", "Teman", "Musik"].map((tab) => (
                    <span
                      key={tab}
                      style={{
                        fontSize: "11px",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        color: tab === "Tugas" ? sky : muted,
                        background: tab === "Tugas" ? skyDim : "transparent",
                        fontWeight: tab === "Tugas" ? 500 : 400,
                      }}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: "rgba(14,165,233,0.2)",
                    color: "#38BDF8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  A
                </div>
              </div>

              {/* Kanban body */}
              <div
                style={{
                  padding: "16px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "10px",
                  position: "relative",
                }}
              >
                {/* Fade bottom overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "100px",
                    background: `linear-gradient(to bottom, transparent, ${card})`,
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />

                {/* Col: Belum */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      paddingBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "#64748B",
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 500,
                        color: "#64748B",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Belum
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "9px",
                        background: "rgba(100,116,139,0.15)",
                        color: "#64748B",
                        padding: "1px 6px",
                        borderRadius: "99px",
                      }}
                    >
                      2
                    </span>
                  </div>
                  {mockCards.belum.map((c_, i) => (
                    <div
                      key={i}
                      style={{
                        background: card2,
                        border: `1px solid ${border}`,
                        borderRadius: "7px",
                        padding: "9px 10px",
                        marginBottom: "6px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 500,
                          color: text,
                          marginBottom: "3px",
                        }}
                      >
                        {c_.title}
                      </div>
                      <div style={{ fontSize: "10px", color: muted }}>
                        {c_.sub}
                      </div>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "5px",
                          borderRadius: "99px",
                          padding: "2px 7px",
                          fontSize: "9px",
                          background: c_.pillBg,
                          color: c_.pillColor,
                        }}
                      >
                        {c_.pill}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Col: Proses */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      paddingBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: sky,
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 500,
                        color: sky,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Proses
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "9px",
                        background: skyDim,
                        color: sky,
                        padding: "1px 6px",
                        borderRadius: "99px",
                      }}
                    >
                      1
                    </span>
                  </div>
                  {mockCards.proses.map((c_, i) => (
                    <div
                      key={i}
                      style={{
                        background: card2,
                        border: `1px solid ${border}`,
                        borderRadius: "7px",
                        padding: "9px 10px",
                        marginBottom: "6px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 500,
                          color: text,
                          marginBottom: "3px",
                        }}
                      >
                        {c_.title}
                      </div>
                      <div style={{ fontSize: "10px", color: muted }}>
                        {c_.sub}
                      </div>
                      <div
                        style={{ display: "flex", marginTop: "6px", gap: "0" }}
                      >
                        {["Z", "I"].map((l, idx) => (
                          <div
                            key={l}
                            style={{
                              width: "18px",
                              height: "18px",
                              borderRadius: "50%",
                              background:
                                idx === 0
                                  ? "rgba(14,165,233,0.2)"
                                  : "rgba(249,115,22,0.2)",
                              color: idx === 0 ? "#38BDF8" : "#FB923C",
                              fontSize: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 600,
                              marginLeft: idx > 0 ? "-5px" : 0,
                              border: `1.5px solid ${card2}`,
                            }}
                          >
                            {l}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Col: Selesai */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      paddingBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "#10B981",
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 500,
                        color: "#10B981",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Selesai
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "9px",
                        background: "rgba(16,185,129,0.15)",
                        color: "#10B981",
                        padding: "1px 6px",
                        borderRadius: "99px",
                      }}
                    >
                      2
                    </span>
                  </div>
                  {mockCards.selesai.map((c_, i) => (
                    <div
                      key={i}
                      style={{
                        background: card2,
                        border: `1px solid ${border}`,
                        borderRadius: "7px",
                        padding: "9px 10px",
                        marginBottom: "6px",
                        opacity: 0.5,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 500,
                          color: text,
                          marginBottom: "3px",
                        }}
                      >
                        {c_.title}
                      </div>
                      <div style={{ fontSize: "10px", color: muted }}>
                        {c_.sub}
                      </div>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "5px",
                          borderRadius: "99px",
                          padding: "2px 7px",
                          fontSize: "9px",
                          background: c_.pillBg,
                          color: c_.pillColor,
                        }}
                      >
                        {c_.pill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fade bawah mockup ke background */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "140px",
                background: `linear-gradient(to bottom, transparent, ${bg})`,
                pointerEvents: "none",
              }}
            />
          </div>
        </div> 
        {/* AKHIR BUNGKUSAN KONTEN UTAMA */}
      </section>

      {/* ── FITUR ── */}
      <section
        style={{ padding: "80px 24px", borderTop: `1px solid ${border}` }}
      >
        <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: sky,
                marginBottom: "12px",
              }}
            >
              Kenapa StudyHub?
            </span>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(24px, 3.5vw, 38px)",
                fontWeight: 700,
                color: text,
                lineHeight: 1.2,
                marginBottom: "12px",
                letterSpacing: "-0.015em",
              }}
            >
              Semua yang kamu butuhkan,
              <br />
              ada di satu tempat.
            </h2>
            <p style={{ color: muted, fontSize: "15px", lineHeight: 1.75 }}>
              Dirancang supaya mahasiswa bisa fokus belajar bukan fokus ngatur
              aplikasi.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(268px, 1fr))",
              gap: "12px",
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  background: card,
                  border: `1px solid ${border}`,
                  borderRadius: "14px",
                  padding: "24px",
                  transition: "border-color 0.2s, transform 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(14,165,233,0.3)";
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    border;
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: skyDim,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "14px",
                  }}
                >
                  {f.icon}
                </div>
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: text,
                    marginBottom: "6px",
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{ color: muted, fontSize: "13px", lineHeight: 1.65 }}
                >
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARA KERJA ── */}
      <section
        style={{
          padding: "80px 24px",
          borderTop: `1px solid ${border}`,
          background: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: sky,
                marginBottom: "12px",
              }}
            >
              Cara Kerja
            </span>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(24px, 3.5vw, 38px)",
                fontWeight: 700,
                color: text,
                lineHeight: 1.2,
                marginBottom: "12px",
                letterSpacing: "-0.015em",
              }}
            >
              Mulai dalam tiga langkah.
            </h2>
            <p style={{ color: muted, fontSize: "15px", lineHeight: 1.75 }}>
              Tidak perlu setup rumit. Daftar, tambah tugas, langsung produktif.
            </p>
          </div>

          <div className="steps-grid" style={{ position: "relative" }}>
            {/* Garis penghubung */}
            <div
              className="steps-connector"
              style={{
                position: "absolute",
                top: "26px",
                left: "calc(16.6% + 12px)",
                right: "calc(16.6% + 12px)",
                height: "1px",
                background: `linear-gradient(to right, ${sky}, rgba(14,165,233,0.2), ${sky})`,
              }}
            />

            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "0 20px" }}>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: skyDim,
                    border: `1px solid rgba(14,165,233,0.3)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Syne, sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: sky,
                    margin: "0 auto 18px",
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: text,
                    marginBottom: "8px",
                  }}
                >
                  {s.title}
                </div>
                <div
                  style={{ color: muted, fontSize: "13px", lineHeight: 1.65 }}
                >
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        style={{ padding: "80px 24px", borderTop: `1px solid ${border}` }}
      >
        <div
          className="final-cta-card"
          style={{
            maxWidth: "520px",
            margin: "0 auto",
            background: card,
            border: `1px solid rgba(14,165,233,0.2)`,
            borderRadius: "20px",
            padding: "48px 36px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "360px",
              height: "280px",
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse, rgba(14,165,233,0.1) 0%, transparent 65%)",
            }}
          />

          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "26px",
              fontWeight: 700,
              color: text,
              marginBottom: "10px",
              letterSpacing: "-0.01em",
            }}
          >
            Siap kuliah lebih teratur?
          </h2>
          <p
            style={{
              color: muted,
              fontSize: "14px",
              lineHeight: 1.75,
              marginBottom: "28px",
            }}
          >
            Bergabung dengan mahasiswa Teknik Informatika UTM yang sudah
            mengelola tugas mereka bersama StudyHub.
          </p>

          <button
            onClick={onGoRegister}
            style={{
              background: sky,
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "14px 32px",
              fontFamily: "Outfit, sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "opacity 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Buat Akun Gratis <ArrowRight size={15} />
          </button>

          <p style={{ marginTop: "16px", fontSize: "13px", color: muted }}>
            Sudah punya akun?{" "}
            <button
              onClick={onGoLogin}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: sky,
                fontFamily: "Outfit, sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                padding: 0,
              }}
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{ borderTop: `1px solid ${border}`, padding: "40px 40px 24px" }}
      >
        <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
          {/* Tim Pengembang */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: sky,
                marginBottom: "16px",
              }}
            >
              Dikembangkan Oleh
            </span>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {developers.map((dev) => (
                <div
                  key={dev.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: card2,
                    border: `1px solid ${border}`,
                    borderRadius: "99px",
                    padding: "7px 8px 7px 14px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: text,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {dev.name}
                  </span>
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`GitHub ${dev.name}`}
                    style={{
                      color: muted,
                      display: "flex",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = sky)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = muted)}
                  >
                    <GithubIcon size={14} />
                  </a>
                  <a
                    href={dev.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram ${dev.name}`}
                    style={{
                      color: muted,
                      display: "flex",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = sky)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = muted)}
                  >
                    <InstagramIcon size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Ajakan kontribusi */}
          <p
            style={{
              textAlign: "center",
              fontSize: "12.5px",
              color: muted,
              marginBottom: "28px",
              lineHeight: 1.7,
            }}
          >
            Mau ikut berkontribusi di project ini? Ajukan saja Pull Request ke
            repo{" "}
            <a
              href="https://github.com/zeovarince/StudyHub.git"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: sky, fontWeight: 500, textDecoration: "none" }}
            >
              zeovarince/StudyHub
            </a>{" "}
            di GitHub.
          </p>

          {/* Baris bawah */}
          <div
            className="footer-bottom-row"
            style={{
              borderTop: `1px solid ${border}`,
              paddingTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "12px",
              color: muted,
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <path
                  d="M24 12L12 18V30L24 36L36 30V18L24 12Z"
                  stroke="#0EA5E9"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <circle cx="24" cy="24" r="3.5" fill="#0EA5E9" />
              </svg>
              <span
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 600,
                  fontSize: "13px",
                  color: text,
                }}
              >
                StudyHub
              </span>
            </div>
            <span>Teknik Informatika · Universitas Trunojoyo Madura</span>
            <span>React · Node.js · MySQL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
