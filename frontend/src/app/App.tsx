import { useState, useEffect } from "react";
import { API_URL } from "./config";
import axios from "axios";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { KanbanBoard } from "./components/KanbanBoard";
import { MusicPage } from "./components/MusicPage";
import { FriendsPage } from "./components/FriendsPage";
import { TaskDetailModal } from "./components/TaskDetailModal";
import { AddTaskModal } from "./components/AddTaskModal";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { LandingPage } from "./components/LandingPage";
import { EditProfileModal } from "./components/EditProfileModal";
import { type Task, type Page } from "./types";
import { ProfilePage } from "./components/ProfilePage";
import { ChatWidget } from "./components/ChatWidget";
import { useIsMobile } from "./components/ui/use-mobile";

// Tambah 'landing' sebagai view pertama sebelum auth
type AuthView = "landing" | "login" | "register";

interface AuthState {
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
  userPhoto?: string;
}

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const isMobile = useIsMobile();
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    userName: "",
    userEmail: "",
  });

  // Default ke 'landing' — user melihat halaman index sebelum login
  const [authView, setAuthView] = useState<AuthView>("landing");

  const [activePage, setActivePage] = useState<Page>("Tugas");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // --- 1. AMBIL DATA DARI BACKEND ---
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const realTasks = response.data.data.map((t: any) => ({
        id: t.id_task.toString(),
        title: t.judul,
        description: t.deskripsi || "",
        deadline: t.due_date.split("T")[0],
        status: t.status,
        members: ["ME"],
        file: t.file_lampiran,
      }));

      setTasks(realTasks);
    } catch (error) {
      console.error("Gagal memuat tugas dari server:", error);
    }
  };

  // Otomatis tarik data setelah berhasil login
  useEffect(() => {
    if (auth.isLoggedIn) {
      fetchTasks();
    }
  }, [auth.isLoggedIn]);

  // --- 2. AUTHENTICATION LOGIC ---
  const handleLogin = (email: string, name: string, photo?: string) => {
    setAuth({
      isLoggedIn: true,
      userName: name,
      userEmail: email,
      userPhoto: photo,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth({ isLoggedIn: false, userName: "", userEmail: "" });
    setAuthView("landing"); // ← Kembali ke landing, bukan langsung login
    setActivePage("Tugas");
    setSelectedTask(null);
    setShowAddModal(false);
    setTasks([]);
  };

  // --- 3. CRUD KANBAN KE DATABASE MYSQL ---
  const moveTask = async (id: string, direction: "forward" | "backward") => {
    const order: Task["status"][] = ["Belum", "Proses", "Selesai"];
    const taskToMove = tasks.find((t) => t.id === id);
    if (!taskToMove) return;

    const idx = order.indexOf(taskToMove.status);
    const newIdx = direction === "forward" ? idx + 1 : idx - 1;
    if (newIdx < 0 || newIdx >= order.length) return;

    const newStatus = order[newIdx];

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
    );

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/tasks/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      console.error("Gagal memindah tugas:", error);
      fetchTasks();
    }
  };

  const updateStatus = async (id: string, status: Task["status"]) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/tasks/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      console.error("Gagal update status:", error);
      fetchTasks();
    }
  };

  const addTask = async (data: Omit<Task, "id">) => {
    try {
      const token = localStorage.getItem("token");

      // 1. Pakai FormData supaya bisa kirim file
      const formData = new FormData();
      formData.append("judul", data.title);
      formData.append("deskripsi", data.description);
      formData.append("mata_kuliah", "Umum");
      formData.append("due_date", data.deadline);

      // 2. Masukkan file ke FormData
      if (data.file) {
        formData.append("file", data.file);
      }

      // 3. Kirim ke backend
      await axios.post(`${API_URL}/api/tasks`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Wajib!
        },
      });

      fetchTasks();
      setShowAddModal(false);
    } catch (error) {
      console.error("Gagal menambah tugas:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks((prev) => prev.filter((t) => t.id !== id));
      setSelectedTask(null);
    } catch (error) {
      console.error("Gagal menghapus tugas:", error);
    }
  };

  // --- RENDERING TAMPILAN ---

  // Belum login: tampilkan landing / login / register
  if (!auth.isLoggedIn) {
    if (authView === "landing") {
      return (
        <LandingPage
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
          onGoLogin={() => setAuthView("login")}
          onGoRegister={() => setAuthView("register")}
        />
      );
    }

    if (authView === "register") {
      return (
        <RegisterPage
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
          onRegister={handleLogin}
          onGoLogin={() => setAuthView("login")}
        />
      );
    }

    // default: 'login'
    return (
      <LoginPage
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        onLogin={handleLogin}
        onGoRegister={() => setAuthView("register")}
      />
    );
  }

  // Sudah login: tampilkan app utama
  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark ? "#09090B" : "#F8FAFC",
        fontFamily: "Outfit, sans-serif",
      }}
    >
      <Navbar
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        activePage={activePage}
        onNavigate={setActivePage}
        userName={auth.userName}
        userEmail={auth.userEmail}
        userPhoto={auth.userPhoto}
        onLogout={handleLogout}
        onEditProfile={() => setShowEditProfile(true)}
      />

      {/* Mobile: header atas 52px (logo saja) + bottom nav 64px di bawah.
          Desktop: top navbar 56px, tidak ada bottom nav. */}
      <main
        style={{
          paddingTop: isMobile ? "52px" : "56px",
          paddingBottom: isMobile ? "76px" : "0",
          minHeight: "100vh",
        }}
      >
        {activePage === "Dashboard" && (
          <Dashboard tasks={tasks} isDark={isDark} />
        )}
        {activePage === "Tugas" && (
          <KanbanBoard
            tasks={tasks}
            isDark={isDark}
            onMoveTask={moveTask}
            onSelectTask={(task) => setSelectedTask(task)}
            onAddTask={() => setShowAddModal(true)}
          />
        )}
        {activePage === "Teman" && <FriendsPage isDark={isDark} />}
        {activePage === "Musik" && <MusicPage isDark={isDark} />}
        {activePage === "Profil" && <ProfilePage isDark={isDark} />}
      </main>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isDark={isDark}
          onClose={() => setSelectedTask(null)}
          onDelete={deleteTask}
          onMarkDone={() => updateStatus(selectedTask.id, "Selesai")}
        />
      )}

      {showAddModal && (
        <AddTaskModal
          isDark={isDark}
          onClose={() => setShowAddModal(false)}
          onAdd={addTask}
        />
      )}

      {showEditProfile && (
        <EditProfileModal
          isDark={isDark}
          currentName={auth.userName}
          currentEmail={auth.userEmail}
          currentPhoto={auth.userPhoto}
          onClose={() => setShowEditProfile(false)}
          onSuccess={(data) =>
            setAuth((prev) => ({
              ...prev,
              userName: data.name,
              userPhoto: data.photo ?? prev.userPhoto,
            }))
          }
        />
      )}

      <ChatWidget isDark={isDark} />
    </div>
  );
}
