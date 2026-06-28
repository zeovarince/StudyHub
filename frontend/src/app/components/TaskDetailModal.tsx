import {
  X,
  CalendarDays,
  Clock,
  Trash2,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Download,
  ExternalLink,
  Users,
  AlertTriangle,
} from "lucide-react";
import {
  type Task,
  colors,
  getDaysUntil,
  formatDate,
  MEMBER_COLORS,
} from "../types";
import { API_URL } from "../config";

interface TaskDetailModalProps {
  task: Task;
  isDark: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onMarkDone: () => void;
}

/* ── helpers ── */
function getDisplayFileName(file: string) {
  // hilangkan prefix timestamp: "1234567890-namafile.pdf" → "namafile.pdf"
  return file.replace(/^\d+-/, "");
}

function getFileUrl(file: string) {
  return `${API_URL}/uploads/${file}`;
}

function isImageFile(file: string) {
  const ext = file.split(".").pop()?.toLowerCase() ?? "";
  return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
}

function isPdfFile(file: string) {
  return file.split(".").pop()?.toLowerCase() === "pdf";
}

function getFileExt(file: string) {
  return (file.split(".").pop()?.toUpperCase() ?? "FILE");
}

/* ── status config ── */
const STATUS_CFG: Record<
  Task["status"],
  { bg: string; text: string; label: string; headerBg: string }
> = {
  Belum: {
    bg: "rgba(100,116,139,0.12)",
    text: "#64748B",
    label: "Belum Dikerjakan",
    headerBg: "linear-gradient(135deg, #334155 0%, #475569 100%)",
  },
  Proses: {
    bg: "rgba(14,165,233,0.12)",
    text: "#0EA5E9",
    label: "Sedang Dikerjakan",
    headerBg: "linear-gradient(135deg, #0369A1 0%, #0EA5E9 100%)",
  },
  Selesai: {
    bg: "rgba(16,185,129,0.12)",
    text: "#10B981",
    label: "Selesai",
    headerBg: "linear-gradient(135deg, #065F46 0%, #10B981 100%)",
  },
};

export function TaskDetailModal({
  task,
  isDark,
  onClose,
  onDelete,
  onMarkDone,
}: TaskDetailModalProps) {
  const c = colors(isDark);
  const days = getDaysUntil(task.deadline);
  const isOverdue = days < 0;
  const isUrgent = days >= 0 && days <= 1;
  const st = STATUS_CFG[task.status];
  const fileUrl = task.file ? getFileUrl(task.file) : null;
  const displayName = task.file ? getDisplayFileName(task.file) : null;

  /* Deadline label & colour */
  const deadlineLabel = isOverdue
    ? `Terlambat ${Math.abs(days)} hari`
    : days === 0
    ? "Hari ini!"
    : days === 1
    ? "Besok"
    : `${days} hari lagi`;
  const deadlineColor = isOverdue
    ? "#EF4444"
    : isUrgent
    ? "#F97316"
    : "#10B981";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "16px",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(460px, calc(100vw - 32px))",
          maxHeight: "calc(100vh - 32px)",
          overflowY: "auto",
          background: c.card,
          borderRadius: "16px",
          fontFamily: "Outfit, sans-serif",
          boxShadow: isDark
            ? "0 24px 64px rgba(0,0,0,0.6)"
            : "0 24px 64px rgba(15,23,42,0.18)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",         // biarkan children yang scroll
        }}
      >

        {/* ── HEADER BERWARNA (seperti Classroom) ── */}
        <div
          style={{
            background: st.headerBg,
            padding: "20px 20px 16px",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* Status pill + Close */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                background: "rgba(255,255,255,0.18)",
                borderRadius: "100px",
                padding: "3px 10px",
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              {st.label}
            </span>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.28)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
              }
            >
              <X size={14} />
            </button>
          </div>

          {/* Judul */}
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              color: "#FFFFFF",
              margin: "0 0 12px 0",
              lineHeight: 1.3,
            }}
          >
            {task.title}
          </h2>

          {/* Deadline info bar */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(0,0,0,0.2)",
              borderRadius: "8px",
              padding: "6px 12px",
            }}
          >
            {isOverdue || isUrgent ? (
              <AlertTriangle size={13} color="#FCD34D" />
            ) : (
              <CalendarDays size={13} color="rgba(255,255,255,0.75)" />
            )}
            <span
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: isOverdue ? "#FCD34D" : "rgba(255,255,255,0.9)",
              }}
            >
              {formatDate(task.deadline)}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: isOverdue ? "#FCD34D" : "rgba(255,255,255,0.6)",
              }}
            >
              · {deadlineLabel}
            </span>
          </div>
        </div>

        {/* ── BODY (scrollable) ── */}
        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >

          {/* Deskripsi */}
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#0EA5E9",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "8px",
              }}
            >
              Deskripsi
            </div>
            <p
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "14px",
                color: task.description ? c.text : c.muted,
                margin: 0,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontStyle: task.description ? "normal" : "italic",
              }}
            >
              {task.description || "Tidak ada deskripsi untuk tugas ini."}
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: c.divider }} />

          {/* Deadline detail row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: isDark ? "#27272A" : "#F8FAFC",
              border: `1px solid ${c.divider}`,
              borderRadius: "10px",
              padding: "10px 14px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                background: `${deadlineColor}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Clock size={16} color={deadlineColor} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "11px",
                  color: c.muted,
                  marginBottom: "2px",
                }}
              >
                Deadline
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: deadlineColor,
                }}
              >
                {formatDate(task.deadline)}{" "}
                <span
                  style={{ fontWeight: 400, fontSize: "12px", color: c.muted }}
                >
                  · {deadlineLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Anggota */}
          {task.members.length > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "10px",
                }}
              >
                <Users size={13} color={c.muted} />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: c.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Anggota ({task.members.length})
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {task.members.slice(0, 6).map((m, i) => (
                  <div
                    key={m + i}
                    title={m}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: MEMBER_COLORS[m] || "#64748B",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: 700,
                      border: `2px solid ${c.card}`,
                      marginLeft: i > 0 ? "-6px" : "0",
                      position: "relative",
                      zIndex: 10 - i,
                    }}
                  >
                    {m.slice(0, 2)}
                  </div>
                ))}
                {task.members.length > 6 && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: c.muted,
                      marginLeft: "4px",
                    }}
                  >
                    +{task.members.length - 6} lainnya
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── FILE LAMPIRAN ── */}
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#0EA5E9",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "10px",
              }}
            >
              File Lampiran
            </div>

            {task.file && fileUrl && displayName ? (
              <div
                style={{
                  border: `1px solid ${isDark ? "#3F3F46" : "#E2E8F0"}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                {/* Preview area — gambar langsung ditampilkan */}
                {isImageFile(task.file) && (
                  <div
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      overflow: "hidden",
                      background: isDark ? "#1C1C1F" : "#F1F5F9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={fileUrl}
                      alt={displayName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        // kalau gambar gagal load, sembunyikan preview
                        (e.currentTarget.parentElement as HTMLElement).style.display =
                          "none";
                      }}
                    />
                  </div>
                )}

                {/* PDF preview placeholder */}
                {isPdfFile(task.file) && (
                  <div
                    style={{
                      width: "100%",
                      height: "100px",
                      background: isDark
                        ? "rgba(239,68,68,0.06)"
                        : "rgba(239,68,68,0.04)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <FileText size={28} color="#EF4444" />
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#EF4444",
                        fontWeight: 500,
                      }}
                    >
                      PDF Document
                    </span>
                  </div>
                )}

                {/* File info bar + action buttons */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 14px",
                    background: isDark ? "#1C1C1F" : "#FAFAFA",
                    borderTop: isImageFile(task.file) || isPdfFile(task.file)
                      ? `1px solid ${isDark ? "#3F3F46" : "#E2E8F0"}`
                      : "none",
                  }}
                >
                  {/* Icon + nama */}
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "8px",
                      background: isImageFile(task.file)
                        ? "rgba(139,92,246,0.12)"
                        : isPdfFile(task.file)
                        ? "rgba(239,68,68,0.12)"
                        : "rgba(14,165,233,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isImageFile(task.file) ? (
                      <ImageIcon size={16} color="#8B5CF6" />
                    ) : (
                      <FileText
                        size={16}
                        color={isPdfFile(task.file) ? "#EF4444" : "#0EA5E9"}
                      />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: c.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {displayName}
                    </div>
                    <div
                      style={{ fontSize: "11px", color: c.muted, marginTop: "1px" }}
                    >
                      {getFileExt(task.file)}
                    </div>
                  </div>

                  {/* Tombol Buka & Download */}
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Buka di tab baru"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "rgba(14,165,233,0.1)",
                        border: "1px solid rgba(14,165,233,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none",
                        transition: "background 0.15s",
                        color: "#0EA5E9",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(14,165,233,0.2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(14,165,233,0.1)")
                      }
                    >
                      <ExternalLink size={14} />
                    </a>
                    <a
                      href={fileUrl}
                      download={displayName}
                      title="Download file"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "rgba(14,165,233,0.1)",
                        border: "1px solid rgba(14,165,233,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none",
                        transition: "background 0.15s",
                        color: "#0EA5E9",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(14,165,233,0.2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(14,165,233,0.1)")
                      }
                    >
                      <Download size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* Tidak ada file */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "24px",
                  border: `1px dashed ${isDark ? "#3F3F46" : "#CBD5E1"}`,
                  borderRadius: "12px",
                  color: c.muted,
                }}
              >
                <FileText size={22} color={isDark ? "#3F3F46" : "#CBD5E1"} />
                <span style={{ fontSize: "13px", fontStyle: "italic" }}>
                  Tidak ada file lampiran
                </span>
              </div>
            )}
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              paddingTop: "4px",
            }}
          >
            {task.status !== "Selesai" && (
              <button
                onClick={() => {
                  onMarkDone();
                  onClose();
                }}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "#FFFFFF",
                  background: "#0EA5E9",
                  border: "none",
                  borderRadius: "10px",
                  padding: "11px",
                  cursor: "pointer",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <CheckCircle size={15} />
                Tandai Selesai
              </button>
            )}
            <button
              onClick={() => onDelete(task.id)}
              style={{
                flex: task.status === "Selesai" ? 1 : 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 500,
                fontSize: "13px",
                color: "#EF4444",
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "10px",
                padding: "11px 16px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(239,68,68,0.12)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(239,68,68,0.06)")
              }
            >
              <Trash2 size={14} />
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}